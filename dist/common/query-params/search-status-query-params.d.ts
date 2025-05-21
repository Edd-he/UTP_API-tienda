import { PaginatedParamsDto } from './paginated-params';
export declare class SearchStatusQueryParamsDto extends PaginatedParamsDto {
    query?: string;
    status?: boolean | null;
}
