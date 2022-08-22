import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsISO8601,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CrawlingRiverlevelData {
  @IsString()
  readonly obscd: string;

  @IsNumber()
  @Min(0)
  readonly water_level: number;

  @IsString()
  @IsISO8601()
  readonly obsdate: string;
}

export class CreateCrawlingRiverlevelBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CrawlingRiverlevelData)
  readonly data: CrawlingRiverlevelData[];
}
