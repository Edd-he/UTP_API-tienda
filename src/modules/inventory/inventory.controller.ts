import {
  Controller,
  Get,
  Headers,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { SearchQueryParamsDto } from '@common/query-params/search-query-params'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'
import { envs } from '@config/envs'

import { InventoryService } from './inventory.service'

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
}
