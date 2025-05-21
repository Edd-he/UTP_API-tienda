import { Module } from '@nestjs/common'
import { ReniecModule } from '@providers/reniec/reniec.module'
import { PrismaModule } from '@providers/prisma/prisma.module'

import { UsersModule } from './modules/users/users.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProductsModule } from './modules/products/products.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    ReniecModule,
    PrismaModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
