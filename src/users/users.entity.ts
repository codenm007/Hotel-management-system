
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type UserPrefixType = "MR" | "MRS" | "Ms" | "MISS" ;
export type UserRoleType = "NU" | "HM" ;
@Entity("users")
export class User {
  @PrimaryGeneratedColumn({unsigned:true})
  id: number;

  @Column({
      type:'enum',
      enum:['MR','MRS','Ms','MISS']
  })
  prefix: UserPrefixType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({type:'date'})
  dob: Date;

  @Column({unique:true})
  email: string;

  @Column()
  passwordHash: string;

  @Column({type:'datetime'})
  createdAt: Date;

  @Column({type:'datetime'})
  updatedAt: Date;

  @Column({
      type:'enum',
      enum:['NU','HM']
    })
  roleCode: UserRoleType;

  @Column()
  profilePic: string;

  @Column()
  cityId: number;

  @Column()
  stateId: number;

  @Column()
  zip_code: number;

  @Column({ default: true })
  isActive: boolean;
}