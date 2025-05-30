export declare enum StockMovementType {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA"
}
export declare class UpdateStockDto {
    productId: number;
    quantity: number;
    type: StockMovementType;
}
