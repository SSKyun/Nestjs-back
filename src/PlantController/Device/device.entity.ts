import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeviceEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    @ManyToOne(type=>User,user=>user.device,{eager : false})
    user : User;

    @Column()
    epump : number;

    @Column()
    etime : number;

    @Column()
    wpump : number;

    @Column()
    wval1 : number

    @Column()
    wtime1 : number;

    @Column()
    wval2 : number;

    @Column()
    wtime2 : number;

    @Column()
    cval1 : number;

    @Column()
    cval2 : number;

    @Column()
    ctime : number;
}