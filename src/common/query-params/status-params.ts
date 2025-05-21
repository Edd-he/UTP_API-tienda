import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

import { PaginatedParamsDto } from './paginated-params'

enum StatusEnum {
  en = 'en',
  dis = 'dis',
  all = 'all',
}

export class StatusParamsDto extends PaginatedParamsDto {
  @ApiProperty({
    description: 'Estado',
    enum: StatusEnum,
    example: 'all',
    default: 'all',
  })
  @IsOptional()
  @IsBoolean({
    message: 'el status debe ser uno de los siguientes valores = en, dis, all',
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return null
    }

    if (value === 'en') return true
    if (value === 'dis') return false
    if (value === 'all') return null

    return value
  })
  status?: boolean | null = null
}
