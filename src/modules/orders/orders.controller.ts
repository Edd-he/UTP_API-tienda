import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserSession } from '@modules/auth/decorators/user-session.decorator'
import { IUserSession } from '@modules/auth/interfaces/user-session.interface'
import { SearchQueryParamsDto } from '@common/query-params/search-query-params'
import { ValidateId } from '@common/pipes/validate-id.pipe'
import { Auth } from '@modules/auth/decorators/auth.decorator'
import { Estado, Rol } from '@prisma/client'

import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

@ApiTags('Ordenes')
@Controller('ordenes')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth([Rol.ESTUDIANTE, Rol.PROFESOR])
  @Post('crear-orden')
  @ApiOperation({
    summary: 'Crea una orden',
  })
  create(
    @UserSession() user: IUserSession,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, user)
  }

  @Get('obtener-ordenes')
  @ApiOperation({
    summary: 'Obtiene todas las ordenes',
  })
  findAll(@Query() params: SearchQueryParamsDto) {
    return this.ordersService.findAll(params)
  }

  @Get(':id/obtener-orden')
  @ApiOperation({
    summary: 'Obtiene una orden',
  })
  findOne(@Param('id', ValidateId) id: number) {
    return this.ordersService.findOne(id)
  }

  @Get(':id/procesar-orden')
  @ApiOperation({
    summary: 'Marca como en proceso una orden',
  })
  process(@Param('id', ValidateId) id: number) {
    return this.ordersService.changeStatusOrder(id, Estado.EN_PROCESO)
  }

  @Get(':id/completar-orden')
  @ApiOperation({
    summary: 'Marca como completada una orden',
  })
  complete(@Param('id', ValidateId) id: number) {
    return this.ordersService.changeStatusOrder(id, Estado.COMPLETADA)
  }

  @Get(':id/cancelar-orden')
  @ApiOperation({
    summary: 'Marca como cancelada una orden',
  })
  cancel(@Param('id', ValidateId) id: number) {
    return this.ordersService.changeStatusOrder(id, Estado.CANCELADA)
  }
}
