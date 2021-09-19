import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Curation } from "./Curation";

@Entity()
export class Block {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  url: string;

  @ManyToOne(() => Curation, (curation) => curation.blocks)
  curation: Curation;

  // TODO: Implement upvotes
}
