import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { IUserSession } from '@auth/interfaces/user-session.interface'
import { generateUUIDV7 } from '@common/utils/uuid'
import { Estado, Prisma } from '@prisma/client'
import { ProductsService } from '@modules/products/products.service'
import { formatDate } from '@common/utils/format-date'
import { InventoryService } from '@modules/inventory/inventory.service'
import { DateTime } from 'luxon'
import { StockMovementType } from '@modules/inventory/dto/update-stock.dto'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrdersQueryParams } from './query-params/orders-query-params'
import { CreateOrderItem } from './dto/create-order-item.dto'

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: PrismaService,
    private readonly productService: ProductsService,
    private readonly inventoryService: InventoryService,
  ) {}
  async create(createOrderDto: CreateOrderDto, session: IUserSession) {
    return await this.db.$transaction(async (prisma) => {
      const { orderItems, ...orderDto } = createOrderDto
      await this.validateOrderItems(orderDto.monto_total, orderItems)

      const order = await prisma.orden.create({
        data: {
          usuario_id: session.id,
          transaccion: generateUUIDV7(),
          estado: Estado.EN_PROCESO,
          ...orderDto,
          Orden_Item: {
            createMany: {
              data: orderItems,
            },
          },
        },
      })

      await Promise.all(
        createOrderDto.orderItems.map(async (item) => {
          await this.inventoryService.updateProductStock({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            tipo: 'SALIDA' as StockMovementType,
          })
        }),
      )

      return {
        ...order,
        creado: formatDate(order.creado),
        hora_programada: formatDate(order.hora_programada),
      }
    })
  }

  async findAll({ page_size, page, query, status }: OrdersQueryParams) {
    const pages = page || 1
    const skip = (pages - 1) * page_size
    const where = {
      AND: [
        query
          ? {
              transaccion: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
      ],
      estado: status as Estado,
    }
    const [orders, total] = await Promise.all([
      this.db.orden.findMany({
        where,
        include: {
          Usuario: {
            omit: {
              contraseña: true,
              creado: true,
              actualizado: true,
              habilitado: true,
              archivado: true,
            },
          },
          Orden_Item: {},
        },
        skip: skip,
        take: page_size,
      }),
      this.db.orden.count({
        where,
      }),
    ])

    const data = orders.map((order) => ({
      ...order,
      creado: formatDate(order.creado),
      hora_programada: formatDate(order.hora_programada),
    }))

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  async findAllToday({ page_size, page, query, status }: OrdersQueryParams) {
    const today = DateTime.now().setZone('America/Lima').startOf('day')
    const tomorrow = today.plus({ days: 1 })
    const pages = page || 1
    const skip = (pages - 1) * page_size

    const where = {
      AND: [
        query
          ? {
              transaccion: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
      ],
      hora_programada: {
        gte: today.toJSDate(),
        lt: tomorrow.toJSDate(),
      },
      estado: status as Estado,
    }

    const [orders, total] = await Promise.all([
      this.db.orden.findMany({
        where,
        include: {
          Usuario: {
            omit: {
              contraseña: true,
              creado: true,
              actualizado: true,
              habilitado: true,
              archivado: true,
            },
          },
          Orden_Item: {},
        },
        skip: skip,
        take: page_size,
      }),
      this.db.orden.count({
        where,
      }),
    ])

    const data = orders.map((order) => ({
      ...order,
      creado: formatDate(order.creado),
      hora_programada: formatDate(order.hora_programada),
    }))

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  async findAllByUser(
    userId: number,
    { page_size, page, query, status }: OrdersQueryParams,
  ) {
    const pages = page || 1
    const skip = (pages - 1) * page_size

    const where = {
      AND: [
        query
          ? {
              transaccion: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
      ],
      estado: status as Estado,
      usuario_id: userId,
    }

    const [orders, total] = await Promise.all([
      this.db.orden.findMany({
        where,
        include: {
          Orden_Item: {},
        },
        skip: skip,
        take: page_size,
      }),
      this.db.orden.count({
        where,
      }),
    ])

    const data = orders.map((order) => ({
      ...order,
      creado: formatDate(order.creado),
      hora_programada: formatDate(order.hora_programada),
    }))

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  async findOne(id: number) {
    const orden = await this.db.orden.findFirst({
      where: {
        id,
      },
      include: {
        Usuario: {
          omit: {
            contraseña: true,
            creado: true,
            actualizado: true,
            habilitado: true,
            archivado: true,
          },
        },
        Orden_Item: {},
      },
    })

    if (!orden) throw new NotFoundException(`La orden del id ${id} no existe`)

    return {
      ...orden,
      creado: formatDate(orden.creado),
      hora_programada: formatDate(orden.hora_programada),
    }
  }

  async changeStatusOrder(id: number, estado: Estado) {
    return await this.db.orden.update({
      where: {
        id,
      },
      data: {
        estado: estado,
      },
    })
  }

  private async validateOrderItems(
    monto_total: number,
    orderItems: CreateOrderItem[],
  ) {
    const productIds = orderItems.map((item) => item.producto_id)
    const products = await this.productService.getProductsByIds(productIds)
    const stocks = await this.inventoryService.getStocksByIds(productIds)
    const productMap = new Map(products.map((p) => [p.id, p]))
    const inventoryMap = new Map(stocks.map((s) => [s.producto_id, s]))
    let total = 0

    for (const item of orderItems) {
      const product = productMap.get(item.producto_id)
      const stock = inventoryMap.get(item.producto_id)
      if (!product)
        throw new NotFoundException(
          `El producto con ID ${item.producto_id} no fue encontrado`,
        )

      if (product.nombre !== item.nombre_producto)
        throw new BadRequestException(
          `El nombre del producto no coincide para el producto con ID ${item.producto_id}`,
        )

      if (Number(product.precio) !== item.precio)
        throw new BadRequestException(
          `El precio no coincide para el producto con ID ${item.producto_id}`,
        )

      if (item.cantidad > stock.stock) {
        throw new BadRequestException(
          `La cantidad solicitada excede stock actual del producto con ID ${item.producto_id}`,
        )
      }
      if (item.cantidad > product.limite_de_orden)
        throw new BadRequestException(
          `La cantidad solicitada excede el límite de orden del producto con ID ${item.producto_id}`,
        )

      if (product.archivado)
        throw new ForbiddenException(
          `El producto con ID ${item.producto_id} está archivado`,
        )

      if (!product.habilitado)
        throw new ForbiddenException(
          `El producto con ID ${item.producto_id} no está habilitado`,
        )

      total += Number(product.precio) * item.cantidad
    }

    if (Number(total.toFixed(2)) !== Number(monto_total.toFixed(2)))
      throw new BadRequestException(
        `El monto total ${monto_total} no coincide con el total calculado ${total}`,
      )
  }
}
