import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '@modules/users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { IUserSession } from '@auth/interfaces/user-session.interface'

import { SignInDto } from './dto/signIn.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register() {}

  async signIn({ correo, contraseña }: SignInDto) {
    const user = await this.userService.getOneByEmail(correo)
    if (!user) {
      throw new UnauthorizedException('El usuario no existe')
    }

    const match = await bcrypt.compare(contraseña, user.contraseña)

    if (!match) throw new UnauthorizedException('La contraseña es incorrecta')

    const payload: IUserSession = {
      id: user.id,
      usuario: user.nombre + ' ' + user.apellidos,
      correo: user.correo,
      rol: user.rol,
    }

    return {
      user: payload,
      tokens: {
        access: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1d',
        }),
        refresh: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        }),
      },
    }
  }

  async signOut() {}

  async refresh(user: IUserSession) {
    const payload: IUserSession = {
      id: user.id,
      usuario: user.usuario,
      correo: user.correo,
      rol: user.rol,
    }
    return {
      access: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
      refresh: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    }
  }
}
