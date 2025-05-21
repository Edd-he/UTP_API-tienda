import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { IUserSession } from '@modules/auth/interfaces/user-session.interface'
import { generateUUIDV7 } from '@common/utils/uuid'
import { Estado, Prisma } from '@prisma/client'
import { ProductsService } from '@modules/products/products.service'
import { SearchQueryParamsDto } from '@common/query-params/search-query-params'

import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: PrismaService,
    private readonly productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto, session: IUserSession) {
    return await this.db.$transaction(async (prisma) => {
      const sale = await prisma.orden.create({
        data: {
          usuario_id: session.id,
          transaccion: generateUUIDV7(),
          estado: Estado.EN_PROCESO,
          ...createOrderDto,
          Orden_Item: {
            createMany: {
              data: createOrderDto.orderItems,
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

      return sale
    })
  }

  async findAll({ page_size, page, query }: SearchQueryParamsDto) {
    const pages = page || 1
    const skip = (pages - 1) * page_size
    return await this.db.orden.findMany({
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
      },
      skip: skip,
      take: page_size,
    })
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

    return orden
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
}
