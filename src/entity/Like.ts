import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Curation } from "./Curation";
import { User } from "./User";
import * as bcrypt from "bcrypt";

@Entity()
export class Like {
  @PrimaryGeneratedColumn("increment")
  like_id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Curation, (curation) => curation.likes, {
    onDelete: "CASCADE",
    cascade: true,
    nullable: true,
  })
  curation: Curation;
}
