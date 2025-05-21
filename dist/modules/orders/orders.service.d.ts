import { PrismaService } from '@providers/prisma/prisma.service';
import { IUserSession } from '@modules/auth/interfaces/user-session.interface';
import { Estado, Prisma } from '@prisma/client';
import { ProductsService } from '@modules/products/products.service';
import { SearchQueryParamsDto } from '@common/query-params/search-query-params';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly db;
    private readonly productService;
    constructor(db: PrismaService, productService: ProductsService);
    create(createOrderDto: CreateOrderDto, session: IUserSession): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    findAll({ page_size, page, query }: SearchQueryParamsDto): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }[]>;
    findOne(id: number): Promise<{
        Usuario: {
            dni: string;
            correo: string;
            id: number;
            nombre: string;
            apellidos: string;
            rol: import(".prisma/client").$Enums.Rol;
        };
        Orden_Item: {
            id: number;
            precio: Prisma.Decimal;
            producto_id: number;
            nombre_producto: string;
            cantidad: number;
            orden_id: number;
        }[];
    } & {
        id: number;
        creado: Date;
        hora_programada: Date;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    changeStatusOrder(id: number, estado: Estado): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
}
