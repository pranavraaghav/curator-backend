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

  @Column()
  title: string;

  /**
   * index might be redundant since curation uses an array of blocks
   * and somehow the order of the array is preserved always?
   */
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
