
import { Column, Entity, PrimaryGeneratedColumn ,BeforeInsert } from 'typeorm';

@Entity("hotels")
export class Hotel {
  @PrimaryGeneratedColumn({unsigned:true})
  id: number;

  @Column({type: "integer"})
  adminId: number;

  @Column()
  name: string;

  @Column()
  brandPic: string;

  @Column()
  email: string;

  @Column({type:'datetime'})
  createdAt: Date;

  @Column({type:'datetime'})
  updatedAt: Date;

  @Column()
  addrLine1: string;

  @Column()
  addrLine2: string;

  @Column()
  lat: string;

  @Column()             
  long: string;

  @Column()
  cityId: number;

  @Column()
  stateId: number;

  @Column()
  zip_code: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

}