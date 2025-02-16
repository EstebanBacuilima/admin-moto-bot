import { Person } from './people';

export class Employee {
  constructor(
    public id: number,
    public personId: number,
    public code: string,
    public active: boolean,
    public person?: Person,
    public creationDate?: Date,
    public updateDate?: Date
  ) {}
}
