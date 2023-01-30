import { BoardStatus } from './board-status.enum';
import {BaseEntity,PrimaryGeneratedColumn,Column, Entity, ManyToOne} from "typeorm";
import { User } from 'src/auth/user.entity';

@Entity()
export class Board extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id:Number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    @ManyToOne(type => User, user => user.boards, {eager: false})
    user: User;
}