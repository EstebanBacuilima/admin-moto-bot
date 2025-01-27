export class ProductFile {
    constructor(
        public id: number,
        public productId: number,
        public code: string,
        public fileCode: string,
        public url: string,
        public active: boolean,
        public creationDate: Date,
        public updateDate: Date
    ) { }
}