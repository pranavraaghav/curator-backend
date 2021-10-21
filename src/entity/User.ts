import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
} from "typeorm";
import { Curation } from "./Curation";
import * as bcrypt from "bcrypt";
import { Like } from "./Like";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  imageurl: string;

  @OneToMany(() => Curation, (curation) => curation.created_by)
  curations: Curation;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
