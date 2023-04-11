import { IsNotEmpty } from "class-validator";

export class CreateMachineDto{
    @IsNotEmpty()
    m_number : string;

    @IsNotEmpty()
    m_address : string;
}