import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { UserProfile } from "./UserProfile";

@Entity()
export class UserLogin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user_login)
  user_profile: UserProfile;
}
