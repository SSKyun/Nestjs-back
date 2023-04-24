import { User } from "src/auth/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Envir_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;
    
    @ManyToOne(type=>User,user=>user.envir_stats,{eager:false})
    user : User;

    @Column({type:'decimal',precision:3,scale:1})
    temperature : number; // 온도

    @Column({type:'decimal',precision:3,scale:1})
    humidity : number; // 습도

    @Column({type:'decimal',precision:3,scale:1})
    soil_humid : number; //토양 수분

    @Column({type:'decimal',precision:3,scale:1})
    grow : number; //생장률

    @Column({type:'decimal',precision:3,scale:1})
    precipitaion : number; 

    @Column({type:'decimal',precision:3,scale:1})
    insolation : number; 

    @CreateDateColumn()
    created_at : Date;
}