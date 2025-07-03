import { Body, Controller } from '@nestjs/common'
import { Post } from '@nestjs/common'

import { EventsService } from './events.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('save-subscription')
  async saveSubscription(@Body() dto: CreateSubscriptionDto) {
    await this.eventsService.saveSubscription(dto)
    return { message: 'Subscripción registrada exitosamente.' }
  }
}
