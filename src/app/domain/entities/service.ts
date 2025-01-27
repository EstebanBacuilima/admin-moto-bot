export class Service {
    constructor(
        public id: number,
        public code: string,
        public name: string,
        public icon: string,
        public active: boolean,
        public changedActive: boolean = false,
        public price: number,
        public description?: string,
        public creationDate?: Date,
        public updateDate?: Date
    ) { }
}
