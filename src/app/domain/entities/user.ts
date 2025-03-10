import { Person } from "./people";

export class User {
  constructor(
    public id: number,
    public personId: number,
    public code: string,
    public displayName: string,
    public email: string,
    public password: string,
    public disabled: boolean,
    public isManagment: boolean,
    public photoUrl?: string,
    public phoneNumber?: string,
    public verificationCode?: string,
    public person?: Person
  ) {}
}
