import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Block } from "./Block";
import { User } from "./User";

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

  @ManyToOne(() => User, (user) => user.curations)
  created_by: User;

  @OneToMany(() => Block, (block) => block.curation, {
    cascade: true,
  })
  blocks: Block[];

  // TODO: Implement upvotes
}
