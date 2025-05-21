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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_session_decorator_1 = require("../auth/decorators/user-session.decorator");
const search_query_params_1 = require("../../common/query-params/search-query-params");
const validate_id_pipe_1 = require("../../common/pipes/validate-id.pipe");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const client_1 = require("@prisma/client");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(user, createOrderDto) {
        return this.ordersService.create(createOrderDto, user);
    }
    findAll(params) {
        return this.ordersService.findAll(params);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    processOrder(id) {
        return this.ordersService.changeStatusOrder(id, client_1.Estado.EN_PROCESO);
    }
    pickupOrder(id) {
        return this.ordersService.changeStatusOrder(id, client_1.Estado.RECOGER);
    }
    abandonOrder(id) {
        return this.ordersService.changeStatusOrder(id, client_1.Estado.ABANDONADA);
    }
    completeOrder(id) {
        return this.ordersService.changeStatusOrder(id, client_1.Estado.COMPLETADA);
    }
    cancelOrder(id) {
        return this.ordersService.changeStatusOrder(id, client_1.Estado.CANCELADA);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, auth_decorator_1.Auth)([client_1.Rol.ESTUDIANTE, client_1.Rol.PROFESOR]),
    (0, common_1.Post)('crear-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Crea una orden',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_session_decorator_1.UserSession)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('obtener-ordenes'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene todas las ordenes',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_query_params_1.SearchQueryParamsDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/obtener-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene una orden',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/procesar-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marca como en proceso una orden',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "processOrder", null);
__decorate([
    (0, common_1.Get)(':id/abandonar-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marca como abandonada una orden',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "pickupOrder", null);
__decorate([
    (0, common_1.Get)(':id/abandonar-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marca como abandonada una orden',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "abandonOrder", null);
__decorate([
    (0, common_1.Get)(':id/completar-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marca como completada una orden',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "completeOrder", null);
__decorate([
    (0, common_1.Get)(':id/cancelar-orden'),
    (0, swagger_1.ApiOperation)({
        summary: 'Marca como cancelada una orden',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', validate_id_pipe_1.ValidateId)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Ordenes'),
    (0, common_1.Controller)('ordenes'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map