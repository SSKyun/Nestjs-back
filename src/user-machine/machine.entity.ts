import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Machine_Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type=>User,user=>user.machines,{eager:false})
    user : User;

    @Column()
    m_number : string;

    @Column()
    m_address : string;
}