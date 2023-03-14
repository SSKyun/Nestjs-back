import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @Length(1,500)
    content : string

    @IsNotEmpty()
    boardId : number; //게시글의 ID
}