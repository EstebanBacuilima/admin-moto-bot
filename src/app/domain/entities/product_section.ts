import { Product } from "./product";
import { Section } from "./section";

export class ProductSection {
    constructor(
        public ProductId: number,
        public SectionId: string,
        public changedActive: boolean = false,
        public active: boolean,
        public product?: Product,
        public section?: Section
    ) { }
}
