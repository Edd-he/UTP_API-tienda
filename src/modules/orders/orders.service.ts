import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { IUserSession } from '@auth/interfaces/user-session.interface'
import { generateUUIDV7 } from '@common/utils/uuid'
import { Estado, Prisma } from '@prisma/client'
import { ProductsService } from '@modules/products/products.service'
import { formatDate } from '@common/utils/format-date'

import { CreateOrderDto } from './dto/create-order.dto'
import { OrdersQueryParams } from './query-params/orders-query-params'
import { CreateOrderItem } from './dto/create-order-item.dto'

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: PrismaService,
    private readonly productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto, session: IUserSession) {
    return await this.db.$transaction(async (prisma) => {
      const { orderItems, ...orderDto } = createOrderDto
      await this.validateOrderItems(orderItems)

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
          await this.productService.updateProductStock(
            item.producto_id,
            item.cantidad,
            'SALIDA',
          )
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
    const orders = await this.db.orden.findMany({
      where: {
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
      skip: skip,
      take: page_size,
    })
    const data = orders.map((order) => {
      return {
        ...order,
        creado: formatDate(order.creado),
        hora_programada: formatDate(order.hora_programada),
      }
    })
    return data
  }

  async findAllToday({ page_size, page, query, status }: OrdersQueryParams) {
    const now = new Date()

    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    )

    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    const pages = page || 1
    const skip = (pages - 1) * page_size
    const orders = await this.db.orden.findMany({
      where: {
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
          gte: today,
          lt: tomorrow,
        },
        estado: status as Estado,
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
      skip: skip,
      take: page_size,
    })

    const data = orders.map((order) => {
      return {
        ...order,
        creado: formatDate(order.creado),
        hora_programada: formatDate(order.hora_programada),
      }
    })
    return data
  }

  async findAllByUser(
    userId: number,
    { page_size, page, query, status }: OrdersQueryParams,
  ) {
    const pages = page || 1
    const skip = (pages - 1) * page_size
    const orders = await this.db.orden.findMany({
      where: {
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
      },
      include: {
        Orden_Item: {},
      },
      skip: skip,
      take: page_size,
    })
    const data = orders.map((order) => {
      return {
        ...order,
        creado: formatDate(order.creado),
        hora_programada: formatDate(order.hora_programada),
      }
    })
    return data
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

  private async validateOrderItems(orderItems: CreateOrderItem[]) {
    const productIds = orderItems.map((item) => item.producto_id)
    const products = await this.productService.getProductsByIds(productIds)

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of orderItems) {
      const product = productMap.get(item.producto_id)
      if (!product)
        throw new Error(`Producto ID ${item.producto_id} no encontrado`)

      if (product.nombre !== item.nombre_producto)
        throw new Error(
          `Nombre del producto no coincide para ID ${item.producto_id}`,
        )

      if (Number(product.precio) !== item.precio)
        throw new Error(
          `Precio no coincide para producto ID ${item.producto_id}`,
        )

      if (item.cantidad > product.stock)
        throw new Error(
          `Cantidad solicitada excede el stock para producto ID ${item.producto_id}`,
        )

      if (item.cantidad > product.limite_de_orden)
        throw new Error(
          `Cantidad excede el límite de orden para producto ID ${item.producto_id}`,
        )

      if (product.archivado)
        throw new Error(`Producto ID ${item.producto_id} no existe`)

      if (!product.habilitado)
        throw new Error(`Producto ID ${item.producto_id} no está habilitado`)
    }
  }
}
