export class RegisterRequest {
  constructor(
    public code: string,
    public idCard: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public photoUrl?: string,
    public phoneNumber?: string
  ) {}
}
