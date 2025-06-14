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
const inventory_service_1 = require("../inventory/inventory.service");
const luxon_1 = require("luxon");
let OrdersService = class OrdersService {
    constructor(db, productService, inventoryService) {
        this.db = db;
        this.productService = productService;
        this.inventoryService = inventoryService;
    }
    async create(createOrderDto, session) {
        return await this.db.$transaction(async (prisma) => {
            const { orderItems, ...orderDto } = createOrderDto;
            await this.validateOrderItems(orderDto.monto_total, orderItems);
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
                await this.inventoryService.updateProductStock({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    tipo: 'SALIDA',
                });
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
        const where = {
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
        };
        const [orders, total] = await Promise.all([
            this.db.orden.findMany({
                where,
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
            }),
            this.db.orden.count({
                where,
            }),
        ]);
        const data = orders.map((order) => ({
            ...order,
            creado: (0, format_date_1.formatDate)(order.creado),
            hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
        }));
        const totalPages = Math.ceil(total / page_size);
        return {
            data,
            total,
            totalPages,
        };
    }
    async findAllToday({ page_size, page, query, status }) {
        const today = luxon_1.DateTime.now().setZone('America/Lima').startOf('day');
        const tomorrow = today.plus({ days: 1 });
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        const where = {
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
                gte: today.toJSDate(),
                lt: tomorrow.toJSDate(),
            },
            estado: status,
        };
        const [orders, total] = await Promise.all([
            this.db.orden.findMany({
                where,
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
            }),
            this.db.orden.count({
                where,
            }),
        ]);
        const data = orders.map((order) => ({
            ...order,
            creado: (0, format_date_1.formatDate)(order.creado),
            hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
        }));
        const totalPages = Math.ceil(total / page_size);
        return {
            data,
            total,
            totalPages,
        };
    }
    async findAllByUser(userId, { page_size, page, query, status }) {
        const pages = page || 1;
        const skip = (pages - 1) * page_size;
        const where = {
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
        };
        const [orders, total] = await Promise.all([
            this.db.orden.findMany({
                where,
                include: {
                    Orden_Item: {},
                },
                skip: skip,
                take: page_size,
            }),
            this.db.orden.count({
                where,
            }),
        ]);
        const data = orders.map((order) => ({
            ...order,
            creado: (0, format_date_1.formatDate)(order.creado),
            hora_programada: (0, format_date_1.formatDate)(order.hora_programada),
        }));
        const totalPages = Math.ceil(total / page_size);
        return {
            data,
            total,
            totalPages,
        };
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
    async validateOrderItems(monto_total, orderItems) {
        const productIds = orderItems.map((item) => item.producto_id);
        const products = await this.productService.getProductsByIds(productIds);
        const stocks = await this.inventoryService.getStocksByIds(productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));
        const inventoryMap = new Map(stocks.map((s) => [s.producto_id, s]));
        let total = 0;
        for (const item of orderItems) {
            const product = productMap.get(item.producto_id);
            const stock = inventoryMap.get(item.producto_id);
            if (!product)
                throw new common_1.NotFoundException(`El producto con ID ${item.producto_id} no fue encontrado`);
            if (product.nombre !== item.nombre_producto)
                throw new common_1.BadRequestException(`El nombre del producto no coincide para el producto con ID ${item.producto_id}`);
            if (Number(product.precio) !== item.precio)
                throw new common_1.BadRequestException(`El precio no coincide para el producto con ID ${item.producto_id}`);
            if (item.cantidad > stock.stock) {
                throw new common_1.BadRequestException(`La cantidad solicitada excede stock actual del producto con ID ${item.producto_id}`);
            }
            if (item.cantidad > product.limite_de_orden)
                throw new common_1.BadRequestException(`La cantidad solicitada excede el límite de orden del producto con ID ${item.producto_id}`);
            if (product.archivado)
                throw new common_1.ForbiddenException(`El producto con ID ${item.producto_id} está archivado`);
            if (!product.habilitado)
                throw new common_1.ForbiddenException(`El producto con ID ${item.producto_id} no está habilitado`);
            total += Number(product.precio) * item.cantidad;
        }
        if (Number(total.toFixed(2)) !== Number(monto_total.toFixed(2)))
            throw new common_1.BadRequestException(`El monto total ${monto_total} no coincide con el total calculado ${total}`);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map