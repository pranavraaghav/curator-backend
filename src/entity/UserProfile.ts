import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Curation } from "./Curation";
import { UserLogin } from "./UserLogin";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  imageurl: string;

  @OneToMany(() => Curation, (curation) => curation.created_by)
  curations: Curation;

  @OneToOne(() => UserLogin, (userLogin) => userLogin.user_profile)
  user_login: UserLogin;
}
