export class Establishment {
    constructor(public id: number,
        public code: string,
        public name: string,
        public active: boolean,
        public latitude: number,
        public longitude: number,
        public changedActive: boolean = false,
        public description?: string,
        public creationDate?: Date,
        public updateDate?: Date
    ) { }
}