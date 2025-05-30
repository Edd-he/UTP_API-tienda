import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ProductsService } from '@modules/products/products.service'
import { PrismaService } from '@providers/prisma/prisma.service'
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params'
import { Prisma } from '@prisma/client'
import { formatDate } from '@common/utils/format-date'
import { PrismaException } from '@providers/prisma/exceptions/prisma.exception'
import { Cron } from '@nestjs/schedule'
import { DateTime } from 'luxon'
@Injectable()
export class InventoryService {
  logger = new Logger('InventoryService')
  constructor(
    private readonly productService: ProductsService,
    private readonly db: PrismaService,
  ) {}

  @Cron('0 10 * * *', {
    timeZone: 'America/Lima',
  })
  testCron() {
    this.logger.log('Ejecutando cron a las 10:00 AM')
  }

  async generateInventory() {
    this.logger.log('Generando Inventario 2:00 AM ')

    const now = DateTime.now().setZone('America/Lima').startOf('day')

    const date = now.toJSDate()

    const products = await this.productService.getActiveProductsIds()

    if (!products.length) {
      this.logger.warn(
        'No hay productos habilitados y no archivados para generar inventario.',
      )
      return
    }

    const data = products.map((p) => ({
      producto_id: p.id,
      fecha: date,
      stock: 0,
      stock_inicial: 0,
    }))

    await this.db.inventario_Diario.createMany({ data })

    this.logger.log(`Inventario diario generado para ${data.length} productos.`)
  }

  async getInventoryToday({
    query,
    page,
    page_size,
  }: SearchStatusQueryParamsDto) {
    const now = DateTime.now().setZone('America/Lima').startOf('day')

    const today = now.toJSDate()

    const skip = (page - 1) * page_size

    const where = {
      fecha: {
        gte: today,
        lt: now.plus({ days: 1 }).toJSDate(),
      },
      producto: {
        archivado: false,
        habilitado: true,
        ...(query && {
          nombre: {
            contains: query,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      },
    }

    const [items, total] = await Promise.all([
      this.db.inventario_Diario.findMany({
        where,
        skip,
        take: page_size,
        omit: { stock_inicial: true },
        include: {
          producto: {
            select: {
              nombre: true,
            },
          },
        },
      }),
      this.db.inventario_Diario.count({ where }),
    ])

    const data = items.map((inv) => ({
      ...inv,
      fecha: formatDate(inv.fecha),
      nombre_producto: inv.producto.nombre,
      ultima_entrada: formatDate(inv.ultima_entrada),
      ultima_salida: formatDate(inv.ultima_salida),
    }))

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`
  }

  async updateProductStock(productId: number, quantity: number, type: string) {
    const now = DateTime.now().setZone('America/Lima').startOf('day')
    const today = now.toJSDate()

    try {
      const currentInventory = await this.db.inventario_Diario.findFirst({
        where: {
          fecha: today,
          producto_id: productId,
          producto: {
            archivado: false,
          },
        },
        select: { stock: true },
      })

      if (!currentInventory)
        throw new BadRequestException(
          'No hay inventario registrado para este producto hoy',
        )

      let movementQuantity = 0
      if (type === 'ENTRADA') {
        movementQuantity = quantity
      }

      if (type === 'SALIDA') {
        movementQuantity =
          quantity > currentInventory.stock
            ? -currentInventory.stock
            : -quantity
      }

      const newStock = await this.db.inventario_Diario.updateMany({
        where: {
          fecha: today,
          producto_id: productId,
          producto: {
            archivado: false,
          },
        },
        data: {
          stock: { increment: movementQuantity },
          ...(type === 'ENTRADA'
            ? { ultima_entrada: new Date() }
            : { ultima_salida: new Date() }),
        },
      })

      return newStock
    } catch (e) {
      if (e.code) throw new PrismaException(e)

      throw new InternalServerErrorException(
        'Hubo un error al actualizar el stock',
      )
    }
  }

  async getStocksByIds(ids: number[]) {
    const now = new Date()
    return await this.db.inventario_Diario.findMany({
      where: {
        fecha: now,
        producto_id: {
          in: ids,
        },
      },
      select: { producto_id: true, stock: true },
    })
  }
}
