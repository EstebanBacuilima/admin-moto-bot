import { ProductFile } from "./product_file";

export class Product {
  constructor(
    public id: number,
    public categoryId: number,
    public brandId: number,
    public code: string,
    public name: string,
    public sku: string,
    public changedActive: boolean = false,
    public active: boolean,
    public productFiles: ProductFile[] = [],
    public price: number,
    public description?: string,
    public creationDate?: Date,
    public updateDate?: Date
  ) { }
}
