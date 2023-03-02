import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserKakaoDto{
    @IsString()
    name : any;

    @IsString()
    kakaoId : any;
}