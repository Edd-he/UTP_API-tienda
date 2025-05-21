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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../providers/prisma/prisma.service");
const uuid_1 = require("../../common/utils/uuid");
const client_1 = require("@prisma/client");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(db, productService) {
        this.db = db;
        this.productService = productService;
    }
    async create(createOrderDto, session) {
        return await this.db.$transaction(async (prisma) => {
            const sale = await prisma.orden.create({
                data: {
                    usuario_id: session.id,
                    transaccion: (0, uuid_1.generateUUIDV7)(),
                    estado: client_1.Estado.EN_PROCESO,
                    ...createOrderDto,
                    Orden_Item: {
                        createMany: {
                            data: createOrderDto.orderItems,
                        },
                    },
                },
            });
            await Promise.all(createOrderDto.orderItems.map(async (item) => {
                await this.productService.updateProductStock(item.producto_id, item.cantidad, 'SALIDA');
            }));
            return sale;
        });
    }
    async findAll({ page_size, page, query }) {
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        return await this.db.orden.findMany({
            where: {
                AND: [
                    query
                        ? {
                            transaccion: {
                                contains: query,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        }
                        : {},
                ],
            },
            skip: skip,
            take: page_size,
        });
    }
    async findOne(id) {
        const orden = await this.db.orden.findFirst({
            where: {
                id,
            },
            include: {
                Usuario: {
                    omit: {
                        contraseña: true,
                        creado: true,
                        actualizado: true,
                        habilitado: true,
                        archivado: true,
                    },
                },
                Orden_Item: {},
            },
        });
        if (!orden)
            throw new common_1.NotFoundException(`La orden del id ${id} no existe`);
        return orden;
    }
    async changeStatusOrder(id, estado) {
        return await this.db.orden.update({
            where: {
                id,
            },
            data: {
                estado: estado,
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map