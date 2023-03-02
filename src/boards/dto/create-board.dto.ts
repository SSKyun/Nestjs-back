import { IsNotEmpty, MinLength } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    @MinLength(2)
    title: string;
    
    @IsNotEmpty()
    description : string;
}