import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manual_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column() //8글자 제한
    device : string;

    @Column({nullable : true})
    rwtime1 : number;

    @Column({nullable : true})
    rwtime2 : number;

    @Column({nullable : true})
    rcval1 : number;

    @Column({nullable : true})
    rcval2 : number

    @Column({nullable : true})
    rctime : number

    @Column({nullable : true})//누적 시간
    accumulated_time : number;

    @Column({nullable : true})//남은 시간
    r_time : number;

    @ManyToOne(type=>User,user=>user.manual,{eager:false})
    user : User;
}