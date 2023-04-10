import { IsNotEmpty } from "class-validator";

export class CreateDeviceDto{

    device: string;

    epump : number;

    etime : number;

    wpump : number;

    wval1 : number

    wtime1 : number;

    wval2 : number;

    wtime2 : number;

    cval1 : number;

    cval2 : number;

    ctime : number;
}