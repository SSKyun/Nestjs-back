import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Device_Stat_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    device : string;

    @Column({nullable : true})
    epump : number;

    @Column({nullable : true})
    etime : number;

    @Column({nullable : true})
    wpump : number;

    @Column({nullable : true})
    wval1 : number

    @Column({nullable : true})
    wtime1 : number;

    @Column({nullable : true})
    wval2 : number;

    @Column({nullable : true})
    wtime2 : number;

    @Column({nullable : true})
    cval1 : number;

    @Column({nullable : true})
    cval2 : number;

    @Column({nullable : true})
    ctime : number;

    @ManyToOne(type=>User,user=>user.device,{eager : false})
    user : User;
}