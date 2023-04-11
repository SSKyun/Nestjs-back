import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manual_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

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

    @Column()//누적 시간
    accumulated_time : number;

    @Column()//남은 시간
    r_time : number;

    @ManyToOne(type=>User,user=>user.manual,{eager:false})
    user : User;
}