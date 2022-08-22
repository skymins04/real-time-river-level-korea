import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class AuthRegisterBodyDTO {
  @IsString()
  @IsIn(['riverlevel', 'crawler'])
  readonly role: string;

  @IsString()
  @Matches(/[a-z|A-Z|0-9]{3,20}/)
  readonly owner: string;

  @IsString()
  readonly admin_key: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
