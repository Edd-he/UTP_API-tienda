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
exports.SignInDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignInDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { correo: { required: true, type: () => String, format: "email", pattern: "/^([AUC]\\d{8})@utp\\.edu\\.pe$/" }, contraseña: { required: true, type: () => String, minLength: 5, maxLength: 20 } };
    }
}
exports.SignInDto = SignInDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido.' }),
    (0, class_validator_1.Matches)(/^([AUC]\d{8})@utp\.edu\.pe$/, {
        message: 'El correo no posee el formato correcto',
    }),
    __metadata("design:type", String)
], SignInDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 20, {
        message: 'La contraseña debe tener entre 8 y 20 caracteres.',
    }),
    __metadata("design:type", String)
], SignInDto.prototype, "contrase\u00F1a", void 0);
//# sourceMappingURL=signIn.dto.js.map