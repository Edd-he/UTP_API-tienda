import { PrismaService } from '@providers/prisma/prisma.service';
import { ReniecService } from '@providers/reniec/reniec.service';
import { IReniecResponse } from '@providers/reniec/interfaces/reniec-response.interface';
import { Rol } from '@prisma/client';
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly db;
    private reniecService;
    constructor(db: PrismaService, reniecService: ReniecService);
    create(createUserDto: CreateUserDto, role: Rol): Promise<{
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
    findAll({ query, page, page_size, enable, }: SearchStatusQueryParamsDto): Promise<{
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
    getOne(id: number): Promise<{
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
    getOneByEmail(correo: string): Promise<{
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
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: number): Promise<{
        id: number;
        message: string;
    }>;
    verifyDni(dni: string): Promise<IReniecResponse>;
}
