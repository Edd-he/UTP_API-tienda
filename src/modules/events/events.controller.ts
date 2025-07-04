import { Body, Controller } from '@nestjs/common'
import { Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { EventsService } from './events.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'

@ApiTags('Eventos')
@Controller('eventos')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('guardar-subscripcion')
  async saveSubscription(@Body() dto: CreateSubscriptionDto) {
    await this.eventsService.saveSubscription(dto)
    return { message: 'Subscripción registrada exitosamente.' }
  }
}
