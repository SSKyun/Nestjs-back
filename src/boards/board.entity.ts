import { BoardStatus } from './board-status.enum';
import {BaseEntity,PrimaryGeneratedColumn,Column, Entity, ManyToOne, CreateDateColumn, BeforeUpdate} from "typeorm";
import { User } from 'src/auth/user.entity';

@Entity()
export class Board extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default : "PUBLIC"})
    status: string;

    @CreateDateColumn()
    createDate : Date;

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

    @ManyToOne(type => User, user => user.boards, {eager: false})
    user: User;
}