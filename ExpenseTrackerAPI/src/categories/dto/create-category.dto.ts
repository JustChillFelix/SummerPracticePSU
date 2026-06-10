import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto { 
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { 
        message: 'Color must be in valid HEX format (e.g. #FF5733)'
    })
    color: string;
}