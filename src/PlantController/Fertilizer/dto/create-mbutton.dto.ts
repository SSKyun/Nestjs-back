import { IsNotEmpty } from "class-validator";

export class Create_mButtonDto{
    @IsNotEmpty()
    manually_btn : Boolean

    @IsNotEmpty()
    manually_time : number
}