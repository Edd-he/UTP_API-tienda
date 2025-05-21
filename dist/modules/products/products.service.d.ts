import { PrismaService } from '@providers/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly db;
    constructor(db: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }>;
    getAll(): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }[]>;
    getActiveProducts(): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }[]>;
    getOne(id: number): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    updateProductStock(productId: number, quantity: number, type: string): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        limite_de_orden: number;
    }>;
}
