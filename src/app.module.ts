import { Module } from '@nestjs/common'
import { ReniecModule } from '@providers/reniec/reniec.module'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { ScheduleModule } from '@nestjs/schedule'
import { OrdersModule } from '@modules/orders/orders.module'
import { CloudinaryModule } from '@providers/cloudinary/cloudinary.module'

import { UsersModule } from './modules/users/users.module'
import { ProductsModule } from './modules/products/products.module'
import { AuthModule } from './modules/auth/auth.module'
import { InventoryModule } from './modules/inventory/inventory.module'

@Module({
  imports: [
    ReniecModule,
    PrismaModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
    CloudinaryModule,
    AuthModule,
    InventoryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
