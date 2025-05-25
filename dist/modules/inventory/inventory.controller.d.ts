import { SearchQueryParamsDto } from '@common/query-params/search-query-params';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(params: SearchQueryParamsDto): Promise<{
        data: {
            fecha: string;
            nombre_producto: string;
            ultima_entrada: string;
            ultima_salida: string;
            producto: {
                nombre: string;
            };
            id: number;
            stock: number;
            producto_id: number;
            stock_inicial: number;
        }[];
        total: number;
        totalPages: number;
    }>;
    generateInventory(auth: string): Promise<void>;
}
