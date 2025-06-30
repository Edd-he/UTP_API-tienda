import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { PrismaService } from '@providers/prisma/prisma.service';
import { SignInDto } from './dto/signIn.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly db;
    constructor(userService: UsersService, jwtService: JwtService, db: PrismaService);
    signIn({ correo, contraseña }: SignInDto): Promise<{
        user: IUserSession;
        tokens: {
            access: string;
            refresh: string;
        };
    }>;
    verifyUserbyEmail(correo: string): Promise<{
        webAuthnCredentials: {
            id: string;
            creado: Date;
            name: string | null;
            usuario_id: number;
            credential_id: Uint8Array;
            public_key: Uint8Array;
            counter: number;
            transport: string | null;
            aaguid: string | null;
        }[];
    } & {
        nombre: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        apellidos: string;
        correo: string;
        contraseña: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
    refresh(user: IUserSession): Promise<{
        access: string;
        refresh: string;
    }>;
    generateRegistrationOptions(correo: string): Promise<import("@simplewebauthn/server").PublicKeyCredentialCreationOptionsJSON>;
    verifyRegistration(dto: VerifyRegistrationDto): Promise<{
        success: boolean;
    }>;
    verifyAuthentication(dto: VerifyRegistrationDto, correo: string): Promise<{
        success: boolean;
        message: string;
        userId: number;
    }>;
}
