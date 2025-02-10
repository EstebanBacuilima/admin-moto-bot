
import { Attribute } from "./attribute";
export class ProductAttribute {
    constructor(
        public productId: number,
        public attributeId: number,
        public value: string,
        public active: boolean,
        public attribute: Attribute,
        public changedActive: boolean = false,
    ) { }
}