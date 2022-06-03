
import { Column, Entity, PrimaryGeneratedColumn ,BeforeInsert } from 'typeorm';

@Entity("reservations")
export class Hotelreservations {
  @PrimaryGeneratedColumn({unsigned:true})
  id: number;

  @Column({type:'datetime'})
  check_in: Date;

  @Column({type:'datetime'})
  check_out: Date;

  @Column()
  no_of_guest: number;

  @Column()
  room_id: number;

  @Column()
  no_of_rooms: number;

  @Column()
  reserved_by: number;

  @Column({type:'datetime'})
  createdAt: Date;

  @Column({type:'datetime'})
  updatedAt: Date;

  @Column({ default: false })
  is_canceled: boolean;

  @Column({ default: false })
  checkedin: boolean;

}