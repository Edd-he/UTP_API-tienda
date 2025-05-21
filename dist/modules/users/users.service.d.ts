import { PrismaService } from '@providers/prisma/prisma.service';
import { ReniecService } from '@providers/reniec/reniec.service';
import { IReniecResponse } from '@providers/reniec/interfaces/reniec-response.interface';
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly db;
    private reniecService;
    constructor(db: PrismaService, reniecService: ReniecService);
    create(createUserDto: CreateUserDto): Promise<{
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
    findAll({ query, page, page_size, status, }: SearchStatusQueryParamsDto): Promise<{
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
    getOne(id: number): Promise<{
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
    getOneByEmail(correo: string): Promise<{
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
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: number): Promise<{
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
    verifyDni(dni: string): Promise<IReniecResponse>;
}
