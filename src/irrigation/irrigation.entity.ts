
import {BaseEntity,PrimaryGeneratedColumn,Column, Entity, ManyToOne, CreateDateColumn} from "typeorm";
import { User } from 'src/auth/user.entity';

@Entity()
export class Irrigation extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    user:string;

    @Column()
    time:number;

    @Column()
    linename:string;

    @Column({ default : false })
    onoff : boolean;

    @Column()
    date : Date;

    @Column()
    start_time : Date;
}