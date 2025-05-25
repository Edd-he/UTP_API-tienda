import { PrismaService } from '@providers/prisma/prisma.service';
import { IUserSession } from '@auth/interfaces/user-session.interface';
import { Estado, Prisma } from '@prisma/client';
import { ProductsService } from '@modules/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryParams } from './query-params/orders-query-params';
export declare class OrdersService {
    private readonly db;
    private readonly productService;
    constructor(db: PrismaService, productService: ProductsService);
    create(createOrderDto: CreateOrderDto, session: IUserSession): Promise<{
        creado: string;
        hora_programada: string;
        id: number;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    findAll({ page_size, page, query, status }: OrdersQueryParams): Promise<{
        creado: string;
        hora_programada: string;
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
        id: number;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }[]>;
    findAllToday({ page_size, page, query, status }: OrdersQueryParams): Promise<{
        creado: string;
        hora_programada: string;
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
        id: number;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }[]>;
    findAllByUser(userId: number, { page_size, page, query, status }: OrdersQueryParams): Promise<{
        creado: string;
        hora_programada: string;
        Orden_Item: {
            id: number;
            precio: Prisma.Decimal;
            producto_id: number;
            nombre_producto: string;
            cantidad: number;
            orden_id: number;
        }[];
        id: number;
        monto_total: Prisma.Decimal;
        transaccion: string;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }[]>;
    findOne(id: number): Promise<{
        creado: string;
        hora_programada: string;
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
        id: number;
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
    private validateOrderItems;
}
