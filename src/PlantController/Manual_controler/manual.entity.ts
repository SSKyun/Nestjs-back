import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manual_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    mc_id : number;

    @Column() //8글자 제한
    machine_id : string;

    @Column()
    etime : number;

    @Column()
    wtime1 : number;

    @Column()
    wtime2 : number;

    @Column()
    ctime1 : number;

    @Column()
    ctime2 : number;

    @Column()
    accumulated_time : number;

    @Column()
    r_time : number;
}