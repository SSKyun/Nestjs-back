import { IsNotEmpty } from 'class-validator';

export class CreateButtonDto {
    @IsNotEmpty()
    user : string;

    @IsNotEmpty()
    time:number;

    @IsNotEmpty()
    linename:string;

    @IsNotEmpty()
    onoff : Boolean;

}