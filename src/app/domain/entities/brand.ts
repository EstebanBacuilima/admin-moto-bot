export class Brand {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public changedActive: boolean = false,
    public active: boolean,
    public description?: string,
    public logo?: string,
    public creationDate?: Date,
    public updateDate?: Date
  ) {}
}
