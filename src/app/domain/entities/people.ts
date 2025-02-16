export class Person {
  constructor(
    public id: number,
    public code: string,
    public idCard: string,
    public firstName: string,
    public lastName: string,
    public active: boolean,
    public email?: string,
    public phomeNumber?: string,
    public creationDate?: Date,
    public updateDate?: Date
  ) {}
}
