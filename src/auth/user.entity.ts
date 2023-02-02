import { Board } from 'src/boards/board.entity';
import { CreateDateColumn, Entity, Index, OneToMany, Unique, UpdateDateColumn } from 'typeorm';
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

    @Column()
    nickname: string;

    @CreateDateColumn()
    createDate : Date;

    @OneToMany(type => Board, board => board.user, {eager: true})
    boards : Board[]
    
    @Column({nullable : true})
    refreshToken: string;
}