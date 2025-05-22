import { SearchStatusQueryParamsDto } from '@common/query-params/search-status-query-params';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryParams } from './query-params/products-query-params';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    getOne(productoId: number): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    getAll(params: SearchStatusQueryParamsDto): Promise<{
        data: {
            habilitado: boolean;
            id: number;
            creado: Date;
            actualizado: Date;
            nombre: string;
            archivado: boolean;
            descripcion: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            limite_de_orden: number;
            categoria: import(".prisma/client").$Enums.Categoria;
            stock: number;
            url: string;
        }[];
        total: number;
        totalPages: number;
    }>;
    getActives(params: ProductsQueryParams): Promise<{
        data: {
            habilitado: boolean;
            id: number;
            creado: Date;
            actualizado: Date;
            nombre: string;
            archivado: boolean;
            descripcion: string;
            precio: import("@prisma/client/runtime/library").Decimal;
            limite_de_orden: number;
            categoria: import(".prisma/client").$Enums.Categoria;
            stock: number;
            url: string;
        }[];
        total: number;
        totalPages: number;
    }>;
    update(productId: number, updateProductDto: UpdateProductDto): Promise<{
        habilitado: boolean;
        id: number;
        creado: Date;
        actualizado: Date;
        nombre: string;
        archivado: boolean;
        descripcion: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        limite_de_orden: number;
        categoria: import(".prisma/client").$Enums.Categoria;
        stock: number;
        url: string;
    }>;
    remove(productoId: number): Promise<{
        message: string;
    }>;
}
