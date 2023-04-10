import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeviceEntity extends BaseEntity{
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

    @Column()
    wval1 : number

    @Column()
    wtime1 : number;

    @Column()
    wval2 : number;

    @Column()
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