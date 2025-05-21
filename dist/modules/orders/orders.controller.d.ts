import { IUserSession } from '@modules/auth/interfaces/user-session.interface';
import { SearchQueryParamsDto } from '@common/query-params/search-query-params';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: IUserSession, createOrderDto: CreateOrderDto): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    findAll(params: SearchQueryParamsDto): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }[]>;
    findOne(id: number): Promise<{
        Orden_Item: {
            id: number;
            nombre_producto: string;
            cantidad: number;
            precio: import("@prisma/client/runtime/library").Decimal;
            producto_id: number;
            orden_id: number;
        }[];
        Usuario: {
            id: number;
            dni: string;
            nombre: string;
            apellidos: string;
            correo: string;
            rol: import(".prisma/client").$Enums.Rol;
        };
    } & {
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    process(id: number): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    complete(id: number): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
    cancel(id: number): Promise<{
        id: number;
        creado: Date;
        hora_programada: Date;
        transaccion: string;
        monto_total: import("@prisma/client/runtime/library").Decimal;
        estado: import(".prisma/client").$Enums.Estado;
        usuario_id: number;
    }>;
}
