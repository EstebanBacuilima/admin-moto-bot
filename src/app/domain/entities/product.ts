import { ProductFile } from "./product_file";

export class Product {
    constructor(
        public id: number,
        public categoryId: number,
        public brandId: number,
        public code: string,
        public name: string,
        public sku: string,
        public description: string,
        public active: boolean,
        public creationDate: Date,
        public updateDate: Date,
        public productFiles: ProductFile[]
    ) { }
}