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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
const prisma_service_1 = require("../../providers/prisma/prisma.service");
const client_1 = require("@prisma/client");
const format_date_1 = require("../../common/utils/format-date");
const prisma_exception_1 = require("../../providers/prisma/exceptions/prisma.exception");
const schedule_1 = require("@nestjs/schedule");
const luxon_1 = require("luxon");
let InventoryService = class InventoryService {
    constructor(productService, db) {
        this.productService = productService;
        this.db = db;
        this.logger = new common_1.Logger('InventoryService');
    }
    testCron() {
        this.logger.log('Ejecutando cron a las 10:00 AM');
    }
    async generateInventory() {
        this.logger.log('Generando Inventario 2:00 AM ');
        const now = luxon_1.DateTime.now().setZone('America/Lima').startOf('day');
        const date = now.toJSDate();
        const products = await this.productService.getActiveProductsIds();
        if (!products.length) {
            this.logger.warn('No hay productos habilitados y no archivados para generar inventario.');
            return;
        }
        const data = products.map((p) => ({
            producto_id: p.id,
            fecha: date,
            stock: 0,
            stock_inicial: 0,
        }));
        await this.db.inventario_Diario.createMany({ data });
        this.logger.log(`Inventario diario generado para ${data.length} productos.`);
    }
    async getInventoryToday({ query, page, page_size, }) {
        const now = luxon_1.DateTime.now().setZone('America/Lima').startOf('day');
        const today = now.toJSDate();
        const skip = (page - 1) * page_size;
        const where = {
            fecha: {
                gte: today,
                lt: now.plus({ days: 1 }).toJSDate(),
            },
            producto: {
                archivado: false,
                habilitado: true,
                ...(query && {
                    nombre: {
                        contains: query,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                }),
            },
        };
        const [items, total] = await Promise.all([
            this.db.inventario_Diario.findMany({
                where,
                skip,
                take: page_size,
                include: {
                    producto: {
                        select: {
                            nombre: true,
                        },
                    },
                },
            }),
            this.db.inventario_Diario.count({ where }),
        ]);
        const data = items.map((inv) => ({
            ...inv,
            fecha: (0, format_date_1.formatDate)(inv.fecha),
            nombre_producto: inv.producto.nombre,
            ultima_entrada: (0, format_date_1.formatDate)(inv.ultima_entrada),
            ultima_salida: (0, format_date_1.formatDate)(inv.ultima_salida),
        }));
        const totalPages = Math.ceil(total / page_size);
        return {
            data,
            total,
            totalPages,
        };
    }
    findOne(id) {
        return `This action returns a #${id} inventory`;
    }
    remove(id) {
        return `This action removes a #${id} inventory`;
    }
    async updateProductStock(productId, quantity, type) {
        const movementQuantity = type === 'ENTRADA' ? quantity : -quantity;
        const now = new Date();
        try {
            const newStock = await this.db.inventario_Diario.updateMany({
                where: {
                    fecha: now,
                    producto_id: productId,
                    producto: {
                        archivado: false,
                    },
                },
                data: {
                    stock: { increment: movementQuantity },
                    ...(type === 'ENTRADA'
                        ? { ultima_entrada: now }
                        : { ultima_salida: now }),
                },
            });
            return newStock;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al actualizar el stock');
        }
    }
    async getStocksByIds(ids) {
        const now = new Date();
        return await this.db.inventario_Diario.findMany({
            where: {
                fecha: now,
                producto_id: {
                    in: ids,
                },
            },
            select: { producto_id: true, stock: true },
        });
    }
};
exports.InventoryService = InventoryService;
__decorate([
    (0, schedule_1.Cron)('0 10 * * *', {
        timeZone: 'America/Lima',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryService.prototype, "testCron", null);
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map