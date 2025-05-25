import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(session: IUserSession, createUserDto: CreateUserDto): Promise<{
        creado: string;
        actualizado: string;
        nombre: string;
        habilitado: boolean;
        id: number;
        dni: string;
        apellidos: string;
        correo: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
    getAllUsers(query: SearchStatusQueryParamsDto): Promise<{
        data: {
            creado: string;
            actualizado: string;
            nombre: string;
            habilitado: boolean;
            id: number;
            dni: string;
            apellidos: string;
            correo: string;
            rol: import(".prisma/client").$Enums.Rol;
        }[];
        total: number;
        totalPages: number;
    }>;
    verifyDni(dni: string): Promise<import("../../providers/reniec/interfaces/reniec-response.interface").IReniecResponse>;
    getOneUser(userId: number): Promise<{
        creado: string;
        actualizado: string;
        nombre: string;
        habilitado: boolean;
        id: number;
        dni: string;
        apellidos: string;
        correo: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
    updateUser(userId: number, session: IUserSession, updateUserDto: UpdateUserDto): Promise<{
        creado: string;
        actualizado: string;
        nombre: string;
        habilitado: boolean;
        id: number;
        dni: string;
        apellidos: string;
        correo: string;
        rol: import(".prisma/client").$Enums.Rol;
    }>;
    removeUser(userId: number): Promise<{
        id: number;
        message: string;
    }>;
}
