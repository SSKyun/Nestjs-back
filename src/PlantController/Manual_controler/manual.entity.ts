import { User } from "src/auth/user.entity";
import { BaseEntity, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manual_Entity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column() //8글자 제한
    device : string;

    @Column({nullable : true})
    rwtime1 : number;

    @Column({nullable : true})
    rwtime2 : number;

    @Column({nullable : true})
    rcval1 : number;

    @Column({nullable : true})
    rcval2 : number

    @Column({nullable : true})
    rctime : number

    @Column({nullable : true})
    accumulated_time : number;

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

    @ManyToOne(type=>User,user=>user.manual,{eager:false})
    user : User;
}