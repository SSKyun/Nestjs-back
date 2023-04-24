import { IsNotEmpty } from "class-validator";

export class CreateEnvirDto{

    temperature : number; // 온도

    humidity : number; // 습도

    soil_humid : number; //토양 수분

    grow : number; //생장률

    precipitaion : number; 

    insolation : number; 

}