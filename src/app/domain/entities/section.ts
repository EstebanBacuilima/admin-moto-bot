import { ProductSection } from "./product_section";

export class Section {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public productSections: ProductSection[] = [],
        public changedActive: boolean = false,
        public active: boolean,
        public description?: string,
        public endDate?: Date,
        public totalProduct?: number
    ) { }
}
