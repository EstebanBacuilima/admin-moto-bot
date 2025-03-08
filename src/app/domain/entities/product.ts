import { Brand } from "./brand";
import { Category } from "./category";
import { ProductAttribute } from "./product_attribute";
import { ProductImage } from "./product_image";

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
    public productImages: ProductImage[] = [],
    public productAttributes: ProductAttribute[] = [],
    public price: number,
    public description?: string,
    public percentage?: number,
    public brand?: Brand,
    public category?: Category,
    public creationDate?: Date,
    public updateDate?: Date
  ) { }
}
