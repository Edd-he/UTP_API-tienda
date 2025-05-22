import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { ReniecService } from '@providers/reniec/reniec.service'
import { IReniecResponse } from '@providers/reniec/interfaces/reniec-response.interface'
import { Prisma, Rol } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { PrismaException } from '@providers/prisma/exceptions/prisma.exception'
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private reniecService: ReniecService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { contraseña, ...rest } = createUserDto

    const { nombres, apellidoMaterno, apellidoPaterno }: IReniecResponse =
      await this.reniecService.getInfoDNI(createUserDto.dni)
    try {
      const newAdmin = await this.db.usuario.create({
        data: {
          nombre: nombres,
          apellidos: apellidoPaterno + ' ' + apellidoMaterno,
          contraseña: await bcrypt.hash(contraseña, 10),
          rol: Rol.ADMINISTRADOR,
          ...rest,
        },
      })

      return newAdmin
    } catch (e) {
      if (e.code) throw new PrismaException(e)

      throw new InternalServerErrorException(
        'Hubo un error al crear el usuario',
      )
    }
  }

  async findAll({
    query,
    page,
    page_size,
    enable,
  }: SearchStatusQueryParamsDto) {
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
      this.db.usuario.findMany({
        omit: {
          contraseña: true,
          archivado: true,
        },
        where,
        skip: skip,
        take: page_size,
      }),
      this.db.usuario.count({ where }),
    ])

    const totalPages = Math.ceil(total / page_size)

    return { data, total, totalPages }
  }

  async getOne(id: number) {
    return await this.db.usuario.findFirst({
      omit: {
        contraseña: true,
        archivado: true,
      },
      where: {
        id,
        archivado: false,
      },
    })
  }

  async getOneByEmail(correo: string) {
    return await this.db.usuario.findFirst({
      omit: {
        archivado: true,
      },
      where: {
        correo,
        archivado: false,
      },
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let nombre: string | null = null
    let apellidos: string | null = null

    if (updateUserDto.dni) {
      const reniec: IReniecResponse = await this.reniecService.getInfoDNI(
        updateUserDto.dni,
      )
      nombre = reniec.nombres
      apellidos = reniec.apellidoPaterno + ' ' + reniec.apellidoMaterno
    }

    try {
      const updatedUser = await this.db.usuario.update({
        where: {
          id,
          archivado: false,
        },
        data: {
          ...updateUserDto,
          ...(nombre && { nombre }),
          ...(apellidos && { apellidos }),
        },
      })

      return updatedUser
    } catch (e) {
      if (e.code) throw new PrismaException(e)

      throw new InternalServerErrorException(
        'Hubo un error al actualizar el usuario',
      )
    }
  }

  async remove(id: number) {
    try {
      const archivedUser = await this.db.usuario.update({
        where: {
          id,
          archivado: false,
        },
        data: {
          habilitado: false,
          archivado: true,
        },
      })

      return archivedUser
    } catch (e) {
      if (e.code) throw new PrismaException(e)

      throw new InternalServerErrorException(
        'Hubo un error al archivar el usuario',
      )
    }
  }

  async verifyDni(dni: string) {
    return await this.reniecService.getInfoDNI(dni)
  }
}
