import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { PrismaException } from '@providers/prisma/exceptions/prisma.exception'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

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

  async getAll() {
    return await this.db.producto.findMany({
      where: {
        archivado: false,
      },
    })
  }

  async getActiveProducts() {
    return await this.db.producto.findMany({
      where: {
        habilitado: true,
        archivado: false,
      },
    })
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
