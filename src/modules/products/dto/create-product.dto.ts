import { Type } from 'class-transformer'
import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateProductDto {
  @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
  nombre: string

  @IsString({
    message: 'La descripción del producto debe ser una cadena de texto',
  })
  descripcion: string

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio del producto debe ser un número decimal' },
  )
  precio: number

  @IsPositive({ message: 'El stock del producto debe ser un número positivo' })
  @IsInt({ message: 'El stock del producto debe ser un número entero' })
  stock: number

  @IsPositive({
    message: 'El limite de orden del producto debe ser un número positivo',
  })
  @IsInt({
    message: 'El limite de orden del producto debe ser un número entero',
  })
  limite_de_orden: number
}
