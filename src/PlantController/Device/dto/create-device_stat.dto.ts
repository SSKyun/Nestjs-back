import { IsNotEmpty } from "class-validator";

export class Create_Device_statDto{
    @IsNotEmpty()
    machine_stat : number;

    // 관수 1 상태
    wval1 : number;

    // 관수 2 상태
    wval2 : number;

    // 액비 1 상태
    cval1 : number;

    // 액비 2 상태
    cval2 : number;

    // 급수 펌프 상태
    epump : number;
}