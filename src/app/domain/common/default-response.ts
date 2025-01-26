export class DefaultResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public totalElements?: number,
    public totalPages?: number,
    public numberOfElements?: number,
    public pageNumber?: number,
    public last?: boolean,
    public first?: boolean,
    public offset?: number,
    public data?: any
  ) {}
}
