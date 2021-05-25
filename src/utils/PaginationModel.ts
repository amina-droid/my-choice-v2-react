export interface PaginationModel {
  limit: number;
  offset: number;
}

export const paginationModel = (page: number, pageSize: number): PaginationModel => ({
  offset: (page - 1) * pageSize,
  limit: pageSize,
});
