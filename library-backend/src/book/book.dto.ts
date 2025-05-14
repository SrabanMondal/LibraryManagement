import {
  IsString,
  IsInt,
  IsArray,
  Min,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsInt()
  published_year: number;

  @IsInt()
  @Min(1)
  total_copies: number;

  @IsInt()
  @Min(0)
  available_copies: number;

  @IsString()
  publisherName: string;

  @IsString()
  categoryName: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  authorNames: string[];
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  published_year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  total_copies?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  available_copies?: number;

  @IsOptional()
  @IsString()
  publisherName?: string;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authorNames?: string[];
}
