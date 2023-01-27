import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description : string;
}//DTO란?
//프로퍼티의 변경이 일어나면 하나하나 다 바꿔줘야하는데
//DTO 파일을 생성하면 그럴 수고가 줄어든다.