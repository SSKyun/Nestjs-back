import { IsNotEmpty } from "class-validator";

export class CreateManualDto {
    @IsNotEmpty()
    device : string;

    rwtime1 : number;

    rwtime2 : number;

    rcval1 : number;

    rcval2 : number;

    rctime : number;
}