import {
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
} from '@nestjs/common'

export const UploadFiles = () => {
  return UploadedFiles(
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
    }),
  )
}

export const UploadFile = () => {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        new FileTypeValidator({ fileType: 'image/*' }), // Solo permite imágenes
      ],
    }),
  )
}
