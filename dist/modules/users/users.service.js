"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../providers/prisma/prisma.service");
const reniec_service_1 = require("../../providers/reniec/reniec.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma_exception_1 = require("../../providers/prisma/exceptions/prisma.exception");
let UsersService = class UsersService {
    constructor(db, reniecService) {
        this.db = db;
        this.reniecService = reniecService;
    }
    async create(createUserDto) {
        const { contraseña, ...rest } = createUserDto;
        const { nombres, apellidoMaterno, apellidoPaterno } = await this.reniecService.getInfoDNI(createUserDto.dni);
        try {
            const newAdmin = await this.db.usuario.create({
                data: {
                    nombre: nombres,
                    apellidos: apellidoPaterno + ' ' + apellidoMaterno,
                    contraseña: await bcrypt.hash(contraseña, 10),
                    rol: client_1.Rol.ADMINISTRADOR,
                    ...rest,
                },
            });
            return newAdmin;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al crear el usuario');
        }
    }
    async findAll({ query, page, page_size, status, }) {
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        return await this.db.usuario.findMany({
            omit: {
                contraseña: true,
                archivado: true,
            },
            where: {
                AND: [
                    query
                        ? {
                            nombre: { contains: query, mode: client_1.Prisma.QueryMode.insensitive },
                        }
                        : {},
                    status !== null && status !== undefined ? { habilitado: status } : {},
                ],
                archivado: false,
            },
            skip: skip,
            take: page_size,
        });
    }
    async getOne(id) {
        return await this.db.usuario.findFirst({
            omit: {
                contraseña: true,
                archivado: true,
            },
            where: {
                id,
                archivado: false,
            },
        });
    }
    async getOneByEmail(correo) {
        return await this.db.usuario.findFirst({
            omit: {
                archivado: true,
            },
            where: {
                correo,
                archivado: false,
            },
        });
    }
    async update(id, updateUserDto) {
        try {
            const updatedUser = await this.db.usuario.update({
                where: {
                    id,
                    archivado: false,
                },
                data: {
                    ...updateUserDto,
                },
            });
            return updatedUser;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al actualizar el usuario');
        }
    }
    async remove(id) {
        try {
            const archivedUser = await this.db.usuario.update({
                where: {
                    id,
                    archivado: false,
                },
                data: {
                    habilitado: false,
                    archivado: true,
                },
            });
            return archivedUser;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al archivar el usuario');
        }
    }
    async verifyDni(dni) {
        return await this.reniecService.getInfoDNI(dni);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reniec_service_1.ReniecService])
], UsersService);
//# sourceMappingURL=users.service.js.map