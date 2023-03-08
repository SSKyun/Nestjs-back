import { IsNotEmpty, MinLength } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    @MinLength(2)
    title: string;
    
    @MinLength(1)
    description : string;

    status : string;
}