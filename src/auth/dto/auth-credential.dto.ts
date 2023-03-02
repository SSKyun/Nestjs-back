import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

    id:number

    // @IsString()
    @MinLength(4)
    username : any;

    // @IsString()
    // @MinLength(4)
    // @MaxLength(20)
    // //영어 2개, 숫자, 특문 1개씩
    // @Matches(/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/,{
    //     message : 'password only accepts english and number'
    // })
    // password : string | null;

    nickname : string;

    phone_number : string;
}