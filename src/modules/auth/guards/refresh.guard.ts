import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractTokenFromHeader(request)

    if (!token)
      throw new UnauthorizedException('No se ha proporcionado un token')

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      } satisfies JwtVerifyOptions)

      request['user'] = payload
    } catch {
      throw new UnauthorizedException('El token proporcionado no es válido')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Refresh' ? token : undefined
  }
}
