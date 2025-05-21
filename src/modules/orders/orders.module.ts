import { Module } from '@nestjs/common'
import { ProductsModule } from '@modules/products/products.module'

import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
