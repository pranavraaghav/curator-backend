import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Block } from "./Block";
import { User } from "./User";
import { Like } from "./Like";

@Entity()
export class Curation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  like_count: 0;

  @OneToMany(() => Like, (like) => like.curation)
  likes: Like;

  @ManyToOne(() => User, (user) => user.curations)
  created_by: User;

  @OneToMany(() => Block, (block) => block.curation, {
    cascade: true,
  })
  blocks: Block[];

  // TODO: Implement upvotes
}
