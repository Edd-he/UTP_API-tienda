import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(session: IUserSession, createUserDto: CreateUserDto): Promise<{
        dni: string;
        correo: string;
        contraseña: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        apellidos: string;
        rol: import(".prisma/client").$Enums.Rol;
        archivado: boolean;
    }>;
    getAllUsers(query: SearchStatusQueryParamsDto): Promise<{
        dni: string;
        correo: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        apellidos: string;
        rol: import(".prisma/client").$Enums.Rol;
    }[]>;
    verifyDni(dni: string): Promise<import("../../providers/reniec/interfaces/reniec-response.interface").IReniecResponse>;
    getOneUser(userId: number): Promise<{
        dni: string;
        correo: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        apellidos: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
    updateUser(userId: number, session: IUserSession, updateUserDto: UpdateUserDto): Promise<{
        dni: string;
        correo: string;
        contraseña: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        apellidos: string;
        rol: import(".prisma/client").$Enums.Rol;
        archivado: boolean;
    }>;
    removeUser(userId: number): Promise<{
        dni: string;
        correo: string;
        contraseña: string;
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        apellidos: string;
        rol: import(".prisma/client").$Enums.Rol;
        archivado: boolean;
    }>;
}
