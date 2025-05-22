import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { PrismaException } from '@providers/prisma/exceptions/prisma.exception'
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params'
import { Categoria, Prisma } from '@prisma/client'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsQueryParams } from './query-params/products-query-params'

@Injectable()
export class ProductsService {
  constructor(private readonly db: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const producto = await this.db.producto.create({
        data: createProductDto,
      })
      return producto
    } catch (e) {
      if (e.code) throw new PrismaException(e)
      throw new InternalServerErrorException(
        'Hubo un error al crear el producto',
      )
    }
  }

  async getAll({ query, page, page_size, enable }: SearchStatusQueryParamsDto) {
    const pages = page || 1
    const skip = (pages - 1) * page_size

    const where = {
      AND: [
        query
          ? {
              nombre: { contains: query, mode: Prisma.QueryMode.insensitive },
            }
          : {},
        enable !== null && enable !== undefined ? { habilitado: enable } : {},
      ],
      archivado: false,
    }

    const [data, total] = await Promise.all([
      this.db.producto.findMany({
        where,
        skip,
        take: page_size,
      }),
      this.db.producto.count({ where }),
    ])

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  async getActiveProducts({
    query,
    page,
    page_size,
    order,
    max_price,
    category,
  }: ProductsQueryParams) {
    const pages = page || 1
    const skip = (pages - 1) * page_size

    const where = {
      nombre: query
        ? { contains: query, mode: Prisma.QueryMode.insensitive }
        : undefined,
      ...(max_price && { precio: { lte: max_price } }),
      ...(category && { categoria: category as Categoria }),
      habilitado: true,
      archivado: false,
    }

    const [data, total] = await Promise.all([
      this.db.producto.findMany({
        where,
        skip,
        take: page_size,
        orderBy: order
          ? { precio: order === 'asc' ? 'asc' : 'desc' }
          : undefined,
      }),
      this.db.producto.count({ where }),
    ])

    const totalPages = Math.ceil(total / page_size)

    return {
      data,
      total,
      totalPages,
    }
  }

  async getOne(id: number) {
    return await this.db.producto.findUnique({
      where: {
        id,
        archivado: false,
      },
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const producto = await this.db.producto.update({
        where: {
          id,
          archivado: false,
        },
        data: updateProductDto,
      })
      return producto
    } catch (e) {
      if (e.code) throw new PrismaException(e)
      throw new InternalServerErrorException(
        'Hubo un error al actualizar el producto',
      )
    }
  }

  async remove(id: number) {
    try {
      const producto = await this.db.producto.update({
        where: {
          id,
          archivado: false,
        },
        data: { archivado: true, habilitado: false },
      })
      if (producto) {
        return { message: 'Producto archivado correctamente' }
      }
    } catch (e) {
      if (e.code) throw new PrismaException(e)
      throw new InternalServerErrorException(
        'Hubo un error al archivar el producto',
      )
    }
  }

  async updateProductStock(productId: number, quantity: number, type: string) {
    const movementQuantity = type === 'ENTRADA' ? quantity : -quantity

    try {
      const newStock = await this.db.producto.update({
        where: {
          id: productId,
          archivado: false,
        },
        data: {
          stock: { increment: movementQuantity },
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
}
