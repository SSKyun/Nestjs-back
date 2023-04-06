import { IsNotEmpty } from 'class-validator';

export class CreateButtonDto {

    @IsNotEmpty()
    sun_day : number;

    @IsNotEmpty()
    mon_day : number;

    @IsNotEmpty()
    tue_day : number;

    @IsNotEmpty()
    wed_day : number;

    @IsNotEmpty()
    thu_day : number;

    @IsNotEmpty()
    fri_day : number;

    @IsNotEmpty()
    sat_day : number;

    @IsNotEmpty()
    s_hour : string;
    
    @IsNotEmpty()
    s_min : string;

    @IsNotEmpty()
    schedule_btn : Boolean;

    @IsNotEmpty()
    line_1 : Boolean;

    @IsNotEmpty()
    line_2 : Boolean;

    @IsNotEmpty()
    line_3 : Boolean;

    @IsNotEmpty()
    onoff : Boolean;

    @IsNotEmpty()
    set_time : number;

    @IsNotEmpty()
    machine_id : string;

}