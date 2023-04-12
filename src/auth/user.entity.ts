import { IrrigationEntity } from '../PlantController/irrigation/irrigation_basic/irrigation.entity';
import { Board } from 'src/boards/board.entity';
import { BeforeUpdate, CreateDateColumn, Entity, Index, OneToMany, Unique, UpdateDateColumn } from 'typeorm';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { minLength } from 'class-validator';
import { Comment } from 'src/comments/comment.entity';
import { Irrigation_m } from 'src/PlantController/irrigation/irrigation_manually/irrigation_m.entity';
import { DeviceEntity } from 'src/PlantController/Device/device.entity';
import { Envir_Entity } from 'src/statistics/envir_stat.entity';
import { Manual_Entity } from 'src/PlantController/Manual_controler/manual.entity';
import { Machine_Entity } from 'src/user-machine/machine.entity';

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

    @Column({ nullable : true})
    address : string;

    @CreateDateColumn() // 통신 서비스 시작일
    ustart_date : Date;

    @Column()
    phone_number : string;

    @Column({ nullable : true}) //총 보유 제어기 수량
    umachine_num : number;

    @Column({ nullable : true}) //통신 서비스 종료일
    uend_date : string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    async save(): Promise<this> {
        this.updatedAt = new Date();
        return super.save();
    }

    @OneToMany(type=> Machine_Entity,machine => machine.user,{eager:true})
    machines : Machine_Entity[]

    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[]

    @OneToMany(type => Comment,comment => comment.user, { eager : true })
    comments : Comment[]

    @OneToMany(type => Irrigation_m,irrigation => irrigation.user, {eager : true})
    irrigation_m : Irrigation_m[]

    @OneToMany(type=> IrrigationEntity,irrigation => irrigation.user, {eager : true})
    irrigations : IrrigationEntity[]

    @OneToMany(type=>Manual_Entity,manual=>manual.user,{eager:true})
    manual : Manual_Entity[]

    @OneToMany(type=>DeviceEntity,device=>device.user,{eager:true})
    device : DeviceEntity[]

    @OneToMany(type=>Envir_Entity,envir_stat => envir_stat.user, {eager:true})
    envir_stats : Envir_Entity[]
    
    @Column({nullable : true})
    refreshToken: string;
    static id: any;
}