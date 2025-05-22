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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ValidateId } from '@common/pipes/validate-id.pipe'
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params'

import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsQueryParams } from './query-params/products-query-params'

@ApiTags('Productos')
@Controller('productos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/crear-producto')
  @ApiOperation({
    summary: 'Crea un producto',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get(':productoID/obtener-producto')
  @ApiOperation({
    summary: 'Obtiene un producto',
  })
  async getOne(@Param('productoID', ValidateId) productoId: number) {
    return this.productsService.getOne(productoId)
  }

  @Get('obtener-productos')
  @ApiOperation({
    summary: 'Obtiene todos los productos',
  })
  async getAll(@Query() params: SearchStatusQueryParamsDto) {
    return this.productsService.getAll(params)
  }

  @Get('obtener-productos-disponibles')
  @ApiOperation({
    summary: 'Obtiene todos los productos disponibles',
  })
  async getActives(@Query() params: ProductsQueryParams) {
    return this.productsService.getActiveProducts(params)
  }

  @Patch(':productoID/actualizar-producto')
  @ApiOperation({
    summary: 'Actualiza la información de un producto',
  })
  async update(
    @Param('productoID', ValidateId) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const admin = await this.productsService.update(productId, updateProductDto)
    return admin
  }

  @Delete(':productoID/remover-producto')
  @ApiOperation({
    summary: 'Archiva un producto',
  })
  async remove(@Param('productoID', ValidateId) productoId: number) {
    const admin = await this.productsService.remove(productoId)
    return admin
  }
}
