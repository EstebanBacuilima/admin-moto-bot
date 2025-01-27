export class TokenResponse {
  constructor(
    public token: string,
    public userCode: string,
    public displayName: string,
    public photoUrl: string
  ) {}
}
