import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(session: IUserSession, createUserDto: CreateUserDto): Promise<{
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        contraseña: string;
        rol: import(".prisma/client").$Enums.Rol;
        habilitado: boolean;
        archivado: boolean;
    }>;
    getAllUsers(query: SearchStatusQueryParamsDto): Promise<{
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        rol: import(".prisma/client").$Enums.Rol;
        habilitado: boolean;
    }[]>;
    verifyDni(dni: string): Promise<import("../../providers/reniec/interfaces/reniec-response.interface").IReniecResponse>;
    getOneUser(userId: number): Promise<{
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        rol: import(".prisma/client").$Enums.Rol;
        habilitado: boolean;
    }>;
    updateUser(userId: number, session: IUserSession, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        contraseña: string;
        rol: import(".prisma/client").$Enums.Rol;
        habilitado: boolean;
        archivado: boolean;
    }>;
    removeUser(userId: number): Promise<{
        id: number;
        creado: Date;
        actualizado: Date;
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        contraseña: string;
        rol: import(".prisma/client").$Enums.Rol;
        habilitado: boolean;
        archivado: boolean;
    }>;
}
