import { User } from 'src/auth/user.entity';
import { BaseEntity, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PesticideEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    sun_day : Boolean

    @Column()
    mon_day : Boolean

    @Column()
    tue_day : Boolean

    @Column()
    wed_day : Boolean

    @Column()
    thu_day : Boolean

    @Column()
    fri_day : Boolean

    @Column()
    sat_day : Boolean

    @Column()
    s_hour : number;
    
    @Column()
    s_min : number;

    @Column({ default : false})
    schedule_btn : Boolean;

    @Column({ default : false })
    manually_btn : Boolean;

    @Column({ default : false})
    line_1 : Boolean;

    @Column({ default : false})
    line_2 : Boolean;

    @Column({ default : false})
    line_3 : Boolean;

    @Column({default : false})
    onoff_manually : Boolean;

    @Column({ default : false})
    onoff : Boolean;

    @CreateDateColumn()
    createDate : Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    @Column()
    set_time : number;

    @Column()
    manually_time : number

    async save(): Promise<this> {
        this.updatedAt = new Date();
        return super.save();
    }

    @Column({type:'int', nullable : true})
    accumulated_time:number;

    @ManyToOne(type=>User, user=>user.pesticides,{eager : false})
    user: User;
}