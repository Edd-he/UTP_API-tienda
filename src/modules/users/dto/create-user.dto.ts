import { Type } from 'class-transformer'
import {
  IsString,
  Length,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator'

export class CreateUserDto {
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 caracteres.' })
  dni: string

  @IsEmail({}, { message: 'El correo electrónico debe ser uno válido' })
  correo: string

  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  @Length(8, 20, {
    message: 'La contraseña debe tener entre 8 y 20 caracteres.',
  })
  contraseña: string

  @Type(() => Boolean)
  @IsBoolean({ message: 'El estado habilitado debe ser un valor booleano.' })
  @IsOptional()
  habilitado?: boolean
}
