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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const envs_1 = require("../../config/envs");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register() { }
    async signIn({ correo, contraseña }) {
        const user = await this.userService.getOneByEmail(correo);
        const match = await bcrypt.compare(contraseña, user.contraseña);
        if (!match)
            throw new common_1.UnauthorizedException('La contraseña es incorrecta');
        const payload = {
            id: user.id,
            usuario: user.nombre + ' ' + user.apellidos,
            correo: user.correo,
            rol: user.rol,
        };
        return {
            user: payload,
            tokens: {
                access: await this.jwtService.signAsync(payload, {
                    secret: envs_1.envs.jwtSecret,
                    expiresIn: '1d',
                }),
                refresh: await this.jwtService.signAsync(payload, {
                    secret: envs_1.envs.jwtRefreshSecret,
                    expiresIn: '7d',
                }),
            },
        };
    }
    async signOut() { }
    async refresh(user) {
        const payload = {
            id: user.id,
            usuario: user.usuario,
            correo: user.correo,
            rol: user.rol,
        };
        return {
            access: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1d',
            }),
            refresh: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map