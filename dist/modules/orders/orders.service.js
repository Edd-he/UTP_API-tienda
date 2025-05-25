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
const format_date_1 = require("../../common/utils/format-date");
let OrdersService = class OrdersService {
    constructor(db, productService) {
        this.db = db;
        this.productService = productService;
    }
    async create(createOrderDto, session) {
        return await this.db.$transaction(async (prisma) => {
            const { orderItems, ...orderDto } = createOrderDto;
            await this.validateOrderItems(orderItems);
            const order = await prisma.orden.create({
                data: {
                    usuario_id: session.id,
                    transaccion: (0, uuid_1.generateUUIDV7)(),
                    estado: client_1.Estado.EN_PROCESO,
                    ...orderDto,
                    Orden_Item: {
                        createMany: {
                            data: orderItems,
                        },
                    },
                },
            });
            await Promise.all(createOrderDto.orderItems.map(async (item) => {
                await this.productService.updateProductStock(item.producto_id, item.cantidad, 'SALIDA');
            }));
            return {
                ...order,
                creado: (0, format_date_1.formatDate)(order.creado),
                hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
            };
        });
    }
    async findAll({ page_size, page, query, status }) {
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        const orders = await this.db.orden.findMany({
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
                estado: status,
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
            skip: skip,
            take: page_size,
        });
        const data = orders.map((order) => {
            return {
                ...order,
                creado: (0, format_date_1.formatDate)(order.creado),
                hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
            };
        });
        return data;
    }
    async findAllToday({ page_size, page, query, status }) {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        const orders = await this.db.orden.findMany({
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
                hora_programada: {
                    gte: today,
                    lt: tomorrow,
                },
                estado: status,
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
            skip: skip,
            take: page_size,
        });
        const data = orders.map((order) => {
            return {
                ...order,
                creado: (0, format_date_1.formatDate)(order.creado),
                hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
            };
        });
        return data;
    }
    async findAllByUser(userId, { page_size, page, query, status }) {
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        const orders = await this.db.orden.findMany({
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
                estado: status,
                usuario_id: userId,
            },
            include: {
                Orden_Item: {},
            },
            skip: skip,
            take: page_size,
        });
        const data = orders.map((order) => {
            return {
                ...order,
                creado: (0, format_date_1.formatDate)(order.creado),
                hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
            };
        });
        return data;
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
        return {
            ...orden,
            creado: (0, format_date_1.formatDate)(orden.creado),
            hora_programada: (0, format_date_1.formatDate)(orden.hora_programada),
        };
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
    async validateOrderItems(orderItems) {
        const productIds = orderItems.map((item) => item.producto_id);
        const products = await this.productService.getProductsByIds(productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of orderItems) {
            const product = productMap.get(item.producto_id);
            if (!product)
                throw new Error(`Producto ID ${item.producto_id} no encontrado`);
            if (product.nombre !== item.nombre_producto)
                throw new Error(`Nombre del producto no coincide para ID ${item.producto_id}`);
            if (Number(product.precio) !== item.precio)
                throw new Error(`Precio no coincide para producto ID ${item.producto_id}`);
            if (item.cantidad > product.stock)
                throw new Error(`Cantidad solicitada excede el stock para producto ID ${item.producto_id}`);
            if (item.cantidad > product.limite_de_orden)
                throw new Error(`Cantidad excede el límite de orden para producto ID ${item.producto_id}`);
            if (product.archivado)
                throw new Error(`Producto ID ${item.producto_id} no existe`);
            if (!product.habilitado)
                throw new Error(`Producto ID ${item.producto_id} no está habilitado`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map