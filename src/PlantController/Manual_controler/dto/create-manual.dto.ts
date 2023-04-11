import { IsNotEmpty } from "class-validator";

export class CreateManualDto {
    @IsNotEmpty()
    machine_id : string;

    etime : number;

    wtime1 : number;

    wtime2 : number;

    ctime1 : number;

    ctime2 : number;
}