import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsNullable } from 'src/decorator/is-nullable.decorator';

class CreateCrawlingRivergaugeData {
  @IsString()
  readonly obscd: string;

  @IsString()
  readonly obsnm: string;

  @IsString()
  readonly mngorg: string;

  @IsString()
  @IsIn(['Y', 'N'])
  readonly flood_warning: string;

  @IsNullable()
  @IsString()
  readonly addr: string | null;

  @IsNullable()
  @IsString()
  @Matches(/^[0-9]+-[0-9]+-[0-9]+$/)
  readonly lon: string | null;

  @IsNullable()
  @IsString()
  @Matches(/^[0-9]+-[0-9]+-[0-9]+$/)
  readonly lat: string | null;

  @IsNullable()
  @IsNumber()
  @Min(0)
  readonly gdt: number | null;

  @IsNullable()
  @IsNumber()
  @Min(0)
  readonly planflood_level: number | null;
}

class UpdateCrawlingRivergaugeData {
  @IsString()
  readonly obscd: string;

  @IsString()
  @IsOptional()
  readonly obsnm?: string;

  @IsString()
  @IsOptional()
  readonly mngorg?: string;

  @IsString()
  @IsIn(['Y', 'N'])
  @IsOptional()
  readonly flood_warning?: string;

  @IsNullable()
  @IsString()
  @IsOptional()
  readonly addr?: string | null;

  @IsNullable()
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]+-[0-9]+-[0-9]+$/)
  readonly lon?: string | null;

  @IsNullable()
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]+-[0-9]+-[0-9]+$/)
  readonly lat?: string | null;

  @IsNullable()
  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly gdt?: number | null;

  @IsNullable()
  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly planflood_level?: number | null;
}

export class CreateCrawlingRivergaugeBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCrawlingRivergaugeData)
  readonly data: CreateCrawlingRivergaugeData[];
}

export class UpdateCrawlingRivergaugeBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCrawlingRivergaugeData)
  readonly data: UpdateCrawlingRivergaugeData[];
}
