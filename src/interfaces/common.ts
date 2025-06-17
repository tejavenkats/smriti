export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageNo: number;
  totalPage: number;
}
