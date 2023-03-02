import { IsNotEmpty } from 'class-validator';

export class CreatePesticideDto {
    
    @IsNotEmpty()
    sun_day : Boolean

    @IsNotEmpty()
    mon_day : Boolean

    @IsNotEmpty()
    tue_day : Boolean

    @IsNotEmpty()
    wed_day : Boolean

    @IsNotEmpty()
    thu_day : Boolean

    @IsNotEmpty()
    fri_day : Boolean

    @IsNotEmpty()
    sat_day : Boolean

    @IsNotEmpty()
    s_hour : string;
    
    @IsNotEmpty()
    s_min : string;

    @IsNotEmpty()
    on_time : string;

    @IsNotEmpty()
    line_1 : Boolean;

    @IsNotEmpty()
    line_2 : Boolean;

    @IsNotEmpty()
    line_3 : Boolean;

    @IsNotEmpty()
    onoff : Boolean;
}