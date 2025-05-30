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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const search_query_params_1 = require("../../common/query-params/search-query-params");
const swagger_1 = require("@nestjs/swagger");
const envs_1 = require("../../config/envs");
const inventory_service_1 = require("./inventory.service");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    findAll(params) {
        return this.inventoryService.getInventoryToday(params);
    }
    async generateInventory(auth) {
        if (auth !== `Bearer ${envs_1.envs.cronSecret}`)
            throw new common_1.UnauthorizedException();
        await this.inventoryService.generateInventory();
    }
    async generateManualInventory() {
        try {
            await this.inventoryService.generateInventory();
        }
        catch (e) {
            return { message: 'Ya se genero el inventario diario' };
        }
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('obtener-inventario-hoy'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene el inventario de hoy',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_query_params_1.SearchQueryParamsDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('generar-inventario'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "generateInventory", null);
__decorate([
    (0, common_1.Get)('generar-inventario-productos'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "generateManualInventory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventario'),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map