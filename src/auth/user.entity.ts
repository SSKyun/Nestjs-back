import { PesticideEntity } from '../PlantController/pesticide/pesticide.entity';
import { IrrigationEntity } from '../PlantController/irrigation/irrigation.entity';
import { Board } from 'src/boards/board.entity';
import { CreateDateColumn, Entity, Index, OneToMany, Unique, UpdateDateColumn } from 'typeorm';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FertilizerEntity } from 'src/PlantController/Fertilizer/fertilizer.entity';
import { minLength } from 'class-validator';

@Entity()
@Unique(["username"])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ nullable : true })
    password : string | null;

    @Column()
    nickname: string;

    @CreateDateColumn()
    createDate : Date;

    @Column({nullable:true})
    phone_number : string;

    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[]

    @OneToMany(type=> IrrigationEntity,irrigation => irrigation.user, {eager : true})
    irrigations : IrrigationEntity[]

    @OneToMany(type=> PesticideEntity,pesticide => pesticide.user, {eager : true})
    pesticides : PesticideEntity[]

    @OneToMany(type=> FertilizerEntity,fertilizer => fertilizer.user, {eager : true})
    fertilizers : FertilizerEntity[]
    
    @Column({nullable : true})
    refreshToken: string;
    static id: any;
}