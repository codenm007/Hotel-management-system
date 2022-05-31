import { Expose } from 'class-transformer';

export enum Role {
  User = 'NU',
  hotelManager = 'HM',
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  accessToken:string;

  @Expose()
  role:string;
}
