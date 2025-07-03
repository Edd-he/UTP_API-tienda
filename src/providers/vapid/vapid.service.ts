import { Injectable, OnModuleInit } from '@nestjs/common'
import * as webPush from 'web-push'

@Injectable()
export class VapidService implements OnModuleInit {
  onModuleInit() {
    const keys = webPush.generateVAPIDKeys()

    console.log('🔑 VAPID_PUBLIC_KEY:', keys.publicKey)
    console.log('🔒 VAPID_PRIVATE_KEY:', keys.privateKey)
  }
}
