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
const prisma_service_1 = require("../../providers/prisma/prisma.service");
const server_1 = require("@simplewebauthn/server");
const web_authn_constants_1 = require("./constants/web-authn.constants");
let AuthService = class AuthService {
    constructor(userService, jwtService, db) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.db = db;
    }
    async signIn({ correo, contraseña }) {
        const user = await this.userService.getOneByEmail(correo);
        const match = await bcrypt.compare(contraseña, user.contraseña);
        if (!match)
            throw new common_1.UnauthorizedException('La contraseña es incorrecta');
        if (!user.habilitado)
            throw new common_1.UnauthorizedException('El usuario esta deshabilitado');
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
    async verifyUserbyEmail(correo) {
        const user = await this.userService.getOneByEmail(correo);
        return user;
    }
    async refresh(user) {
        const payload = {
            id: user.id,
            usuario: user.usuario,
            correo: user.correo,
            rol: user.rol,
        };
        return {
            access: await this.jwtService.signAsync(payload, {
                secret: envs_1.envs.jwtSecret,
                expiresIn: '1d',
            }),
            refresh: await this.jwtService.signAsync(payload, {
                secret: envs_1.envs.jwtSecret,
                expiresIn: '7d',
            }),
        };
    }
    async generateRegistrationOptions(correo) {
        const user = await this.userService.getOneByEmail(correo);
        const userCreds = await this.db.webAuthnCredential.findMany({
            where: { usuario_id: user.id },
        });
        return (0, server_1.generateRegistrationOptions)({
            rpName: 'UTP cafeteria',
            rpID: web_authn_constants_1.WEB_AUTHN_RPID,
            userID: new TextEncoder().encode(user.id.toString()),
            userName: user.correo,
            attestationType: 'none',
            excludeCredentials: userCreds.map((cred) => ({
                id: Buffer.from(cred.credential_id).toString('base64'),
                type: 'public-key',
                transports: ['internal'],
            })),
            authenticatorSelection: {
                userVerification: 'required',
                authenticatorAttachment: 'platform',
            },
        });
    }
    async verifyRegistration(dto) {
        const { credential, expectedChallenge, userId } = dto;
        const user = await this.db.usuario.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const verification = await (0, server_1.verifyRegistrationResponse)({
            response: credential,
            expectedChallenge,
            expectedOrigin: web_authn_constants_1.WEB_AUTHN_ORIGIN,
            expectedRPID: web_authn_constants_1.WEB_AUTHN_RPID,
        });
        if (!verification.verified || !verification.registrationInfo) {
            throw new common_1.BadRequestException('Verificación fallida');
        }
        const { credential: { id, publicKey, counter }, } = verification.registrationInfo;
        await this.db.webAuthnCredential.create({
            data: {
                credential_id: Buffer.from(id),
                public_key: Buffer.from(publicKey),
                counter,
                Usuario: { connect: { id: userId } },
            },
        });
        return { success: true };
    }
    async verifyAuthentication(dto, correo) {
        const user = await this.userService.getOneByEmail(correo);
        const credential = user.webAuthnCredentials.find((cred) => Buffer.from(cred.credential_id).toString('base64') ===
            dto.credential.rawId);
        if (!credential) {
            throw new common_1.BadRequestException('Credencial no encontrada');
        }
        const verification = await (0, server_1.verifyAuthenticationResponse)({
            response: dto.credential,
            expectedChallenge: dto.expectedChallenge,
            expectedOrigin: web_authn_constants_1.WEB_AUTHN_ORIGIN,
            expectedRPID: web_authn_constants_1.WEB_AUTHN_RPID,
            credential: {
                id: Buffer.from(credential.credential_id).toString('base64'),
                publicKey: credential.public_key,
                counter: credential.counter,
                transports: ['internal'],
            },
        });
        const { verified, authenticationInfo } = verification;
        if (!verified || !authenticationInfo) {
            throw new common_1.BadRequestException('Verificación de autenticación fallida');
        }
        await this.db.webAuthnCredential.update({
            where: { id: credential.id },
            data: {
                counter: authenticationInfo.newCounter,
            },
        });
        return {
            success: true,
            message: 'Inicio de sesión biométrico exitoso',
            userId: user.id,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map