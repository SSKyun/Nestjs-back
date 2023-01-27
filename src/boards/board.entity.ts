import { BoardStatus } from './board-status.enum';
import {BaseEntity,PrimaryGeneratedColumn,Column, Entity} from "typeorm";

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
}