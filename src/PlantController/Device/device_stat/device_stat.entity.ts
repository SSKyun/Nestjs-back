import { Machine_Entity } from "src/user-machine/machine.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device_stat_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    machine_stat : number;

    @Column() // 관수 1 상태
    wval1 : number;

    @Column() // 관수 2 상태
    wval2 : number;

    @Column() // 액비 1 상태
    cval1 : number;

    @Column() // 액비 2 상태
    cval2 : number;

    @Column() // 급수 펌프 상태
    epump : number;

    @ManyToOne(type=>Machine_Entity,machine => machine.device_stat,{eager:false})
    m_number : Machine_Entity //제어기 내부번호.
}