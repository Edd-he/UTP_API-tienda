import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params'
import { PublicAccess } from '@auth/decorators/public.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ValidateId } from '@common/pipes/validate-id.pipe'
import { IUserSession } from '@auth/interfaces/user-session.interface'
import { UserSession } from '@modules/auth/decorators/user-session.decorator'

import { ValidateDNI } from './pipes/validate-dni.pipe'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('crear-usuario')
  @ApiOperation({
    summary: 'Crea un usuario del sistema',
  })
  async createUser(
    @UserSession() session: IUserSession,
    @Body() createUserDto: CreateUserDto,
  ) {
    const admin = await this.usersService.create(createUserDto)
    return admin
  }

  @Get('obtener-todos-los-usuarios')
  @ApiOperation({
    summary: 'Obtiene todos los usuarios',
  })
  async getAllUsers(@Query() query: SearchStatusQueryParamsDto) {
    return this.usersService.findAll(query)
  }

  @PublicAccess()
  @Get(':usuarioDNI/verificar-dni')
  @ApiOperation({
    summary: 'Verifica el dni de un usuario',
  })
  async verifyDni(@Param('usuarioDNI', ValidateDNI) dni: string) {
    return this.usersService.verifyDni(dni)
  }

  @Get(':usuarioID/obtener-usuario')
  @ApiOperation({
    summary: 'Obtiene un usuario',
  })
  async getOneUser(@Param('usuarioID', ValidateId) userId: number) {
    return this.usersService.getOne(userId)
  }

  @Patch(':usuarioID/actualizar-usuario')
  @ApiOperation({
    summary: 'Actualiza la información de un usuario',
  })
  async updateUser(
    @Param('usuarioID', ValidateId) userId: number,
    @UserSession() session: IUserSession,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const admin = await this.usersService.update(userId, updateUserDto)
    return admin
  }

  @Delete(':usuarioID/remover-usuario')
  @ApiOperation({
    summary: 'Archiva un usuario',
  })
  async removeUser(@Param('usuarioID', ValidateId) userId: number) {
    const admin = await this.usersService.remove(userId)
    return admin
  }
}
