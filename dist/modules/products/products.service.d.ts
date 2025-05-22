import { PrismaService } from '@providers/prisma/prisma.service';
import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryParams } from './query-params/products-query-params';
export declare class ProductsService {
    private readonly db;
    constructor(db: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        creado: string;
        actualizado: string;
        habilitado: boolean;
        id: number;
        nombre: string;
        descripcion: string;
        precio: Prisma.Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    getAll({ query, page, page_size, enable }: SearchStatusQueryParamsDto): Promise<{
        data: {
            creado: string;
            actualizado: string;
            habilitado: boolean;
            id: number;
            nombre: string;
            descripcion: string;
            precio: Prisma.Decimal;
            limite_de_orden: number;
            categoria: import(".prisma/client").$Enums.Categoria;
            stock: number;
            url: string;
        }[];
        total: number;
        totalPages: number;
    }>;
    getActiveProducts({ query, page, page_size, order, max_price, category, }: ProductsQueryParams): Promise<{
        data: {
            creado: string;
            actualizado: string;
            habilitado: boolean;
            id: number;
            nombre: string;
            descripcion: string;
            precio: Prisma.Decimal;
            limite_de_orden: number;
            categoria: import(".prisma/client").$Enums.Categoria;
            stock: number;
            url: string;
        }[];
        total: number;
        totalPages: number;
    }>;
    getOne(id: number): Promise<{
        creado: string;
        actualizado: string;
        habilitado: boolean;
        id: number;
        nombre: string;
        descripcion: string;
        precio: Prisma.Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        creado: string;
        actualizado: string;
        habilitado: boolean;
        id: number;
        nombre: string;
        descripcion: string;
        precio: Prisma.Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        message: string;
    }>;
    updateProductStock(productId: number, quantity: number, type: string): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        descripcion: string;
        precio: Prisma.Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
}
