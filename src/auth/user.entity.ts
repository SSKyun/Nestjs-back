import { Board } from 'src/boards/board.entity';
import { Entity, Index, OneToMany, Unique } from 'typeorm';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => Board, board => board.user, {eager: true})
    boards : Board[]
}