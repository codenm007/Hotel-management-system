
import { Column, Entity, PrimaryGeneratedColumn ,BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

   @BeforeInsert()
   emailToLowerCase(){
       this.email = this.email.toLowerCase();
   }

   @BeforeInsert()
   async hashPassword(){
      this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
   }
}