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

  @Column({
    default: 0,
  })
  index: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Curation, (curation) => curation.blocks, {
    onDelete: "CASCADE",
  })
  curation: Curation;
}
