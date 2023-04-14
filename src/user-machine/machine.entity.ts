// import { Device_stat_Entity } from "src/PlantController/Device/device_stat/device_stat.entity";
import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Machine_Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type=>User,user=>user.machines,{eager:false})
    user : User;

    @Column()
    device : string;

    @Column()
    m_address : string;

    // @OneToMany(type=>Device_stat_Entity,device=>device.device,{eager:true})
    // device_stat : Device_stat_Entity[]
}