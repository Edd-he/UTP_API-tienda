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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../providers/prisma/prisma.service");
const prisma_exception_1 = require("../../providers/prisma/exceptions/prisma.exception");
let ProductsService = class ProductsService {
    constructor(db) {
        this.db = db;
    }
    async create(createProductDto) {
        try {
            const producto = await this.db.producto.create({
                data: createProductDto,
            });
            return producto;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al crear el producto');
        }
    }
    async getAll() {
        return await this.db.producto.findMany({
            where: {
                archivado: false,
            },
        });
    }
    async getActiveProducts() {
        return await this.db.producto.findMany({
            where: {
                habilitado: true,
                archivado: false,
            },
        });
    }
    async getOne(id) {
        return await this.db.producto.findUnique({
            where: {
                id,
                archivado: false,
            },
        });
    }
    async update(id, updateProductDto) {
        try {
            const producto = await this.db.producto.update({
                where: {
                    id,
                    archivado: false,
                },
                data: updateProductDto,
            });
            return producto;
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al actualizar el producto');
        }
    }
    async remove(id) {
        try {
            const producto = await this.db.producto.update({
                where: {
                    id,
                    archivado: false,
                },
                data: { archivado: true, habilitado: false },
            });
            if (producto) {
                return { message: 'Producto archivado correctamente' };
            }
        }
        catch (e) {
            if (e.code)
                throw new prisma_exception_1.PrismaException(e);
            throw new common_1.InternalServerErrorException('Hubo un error al archivar el producto');
        }
    }
    async updateProductStock(productId, quantity, type) {
        const movementQuantity = type === 'ENTRADA' ? quantity : -quantity;
        try {
            const newStock = await this.db.producto.update({
                where: {
                    id: productId,
                    archivado: false,
                },
                data: {
                    stock: { increment: movementQuantity },
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map