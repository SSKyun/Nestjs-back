import { User } from '../auth/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from 'src/boards/board.entity';

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    content : string;

    @ManyToOne(type => User, user=>user.comments, {eager:false})
    user:User;

    @ManyToOne(type=> Board,board=>board.comments, {eager:false})
    board:Board;
}