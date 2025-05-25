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

  @Get('cron/generate-inventory')
  @ApiExcludeEndpoint()
  async generateInventory(@Headers('Authorization') auth: string) {
    if (auth !== envs.cronSecret) throw new UnauthorizedException()

    await this.inventoryService.generateInventory()
  }
}
