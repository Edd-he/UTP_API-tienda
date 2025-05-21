import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
        stock: number;
        limite_de_orden: number;
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
        stock: number;
        limite_de_orden: number;
    }>;
    getActives(): Promise<{
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
    update(productId: number, updateProductDto: UpdateProductDto): Promise<{
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
    remove(productoId: number): Promise<{
        message: string;
    }>;
}
