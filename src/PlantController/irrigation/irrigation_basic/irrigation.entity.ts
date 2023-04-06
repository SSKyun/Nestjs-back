import {BaseEntity,PrimaryGeneratedColumn,Column, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeUpdate} from "typeorm";
import { User } from 'src/auth/user.entity';

@Entity()
export class IrrigationEntity extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    sun_day : number

    @Column()
    mon_day : number

    @Column()
    tue_day : number

    @Column()
    wed_day : number

    @Column()
    thu_day : number

    @Column()
    fri_day : number

    @Column()
    sat_day : number

    @Column() 
    s_hour : string; // 시작 시간
    
    @Column()
    s_min : string; //시작 분

    @Column({ default : false})
    schedule_btn : Boolean;

    @Column({ default : false})
    line_1 : Boolean; // 관수

    @Column({ default : false})
    line_2 : Boolean; // 액비

    @Column({ default : false})
    line_3 : Boolean;

    @Column({ default : false})
    onoff : Boolean; //현재 상태

    @Column()
    machine_id : string;

    @CreateDateColumn()
    createDate : Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date; //수정 시간

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    async save(): Promise<this> {
        this.updatedAt = new Date();
        return super.save();
    }

    @Column({default : 0})
    Count : number; // 카운트

    @Column()
    set_time : number; // 동작 몇분 

    @Column({type:'int', nullable : true})
    accumulated_time:number; // 누적 시간
    
    @ManyToOne(type=>User, user=>user.irrigations,{eager : false})
    user: User;
}