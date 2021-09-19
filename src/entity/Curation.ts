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
import { UserProfile } from "./UserProfile";

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

  @Column({ nullable:true })
  description: string;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.curations)
  created_by: UserProfile;

  @OneToMany(() => Block, (block) => block.curation)
  blocks: Block;
  // TODO: Implement upvotes
}
