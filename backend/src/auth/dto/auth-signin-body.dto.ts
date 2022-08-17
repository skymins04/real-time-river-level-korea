import { IsString, Matches } from 'class-validator';

export class AuthSigninBodyDTO {
  @IsString()
  @Matches(/[0-9|A-Z]{7}-[0-9|A-Z]{7}-[0-9|A-Z]{7}-[0-9|A-Z]{7}/)
  readonly api_key: string;

  @IsString()
  @Matches(/[0-9|A-Z]{7}-[0-9|A-Z]{7}-[0-9|A-Z]{7}-[0-9|A-Z]{7}/)
  readonly api_secret: string;
}
