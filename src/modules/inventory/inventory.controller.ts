import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { SearchQueryParamsDto } from '@common/query-params/search-query-params'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'
import { envs } from '@config/envs'

import { InventoryService } from './inventory.service'
import { UpdateStockDto } from './dto/update-stock.dto'

@ApiTags('Inventario')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('obtener-inventario-hoy')
  @ApiOperation({
    summary: 'Obtiene el inventario de hoy',
  })
  findAll(@Query() params: SearchQueryParamsDto) {
    return this.inventoryService.getInventoryToday(params)
  }

  @Get('generar-inventario')
  @ApiExcludeEndpoint()
  async generateInventory(@Headers('authorization') auth: string) {
    if (auth !== `Bearer ${envs.cronSecret}`) throw new UnauthorizedException()

    await this.inventoryService.generateInventory()
  }

  @Get('generar-inventario-productos')
  async generateManualInventory() {
    try {
      await this.inventoryService.generateInventory()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return { message: 'Ya se genero el inventario diario' }
    }
  }

  @Patch('actualizar-stock')
  async updateStock(@Body() updateStockDto: UpdateStockDto) {
    const { productId, quantity, type } = updateStockDto
    await this.inventoryService.updateProductStock(productId, quantity, type)
    return { message: 'Stock actualizado del producto ' + productId }
  }
}
