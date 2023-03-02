import { BoardStatus } from './board-status.enum';
import {BaseEntity,PrimaryGeneratedColumn,Column, Entity, ManyToOne, CreateDateColumn} from "typeorm";
import { User } from 'src/auth/user.entity';

@Entity()
export class Board extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    @CreateDateColumn()
    createDate : Date;

    @ManyToOne(type => User, user => user.boards, {eager: false})
    user: User;
}