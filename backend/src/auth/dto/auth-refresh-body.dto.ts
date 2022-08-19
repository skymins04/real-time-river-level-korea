import { IsString } from 'class-validator';

export class AuthRefreshBodyDTO {
  @IsString()
  readonly refresh_token: string;
}
