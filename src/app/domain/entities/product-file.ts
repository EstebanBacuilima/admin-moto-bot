export class ProductFile {
  constructor(
    public id: number,
    public productId: number,
    public code: string,
    public fileCode: string,
    public active: boolean
  ) {}
}
