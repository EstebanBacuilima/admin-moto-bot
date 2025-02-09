export class Attribute {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public active: boolean,
        public description?: string,
        public changedActive: boolean = false,
    ) { }
}