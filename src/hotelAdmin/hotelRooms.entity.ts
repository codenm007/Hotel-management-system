
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

export type FacilitiesPrefixType = "ACKO" | "NOACKO";


@Entity("hotel_rooms")
export class HotelRooms {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: "integer" })
    hotel_id: number;

    @Column({ type: "integer" })
    room_type_id: number;

    @Column({ type: "integer" })
    rooms_available: number;

    @Column({
        type: 'enum',
        enum: ['ACKO', 'NOACKO']
    })
    facilities: FacilitiesPrefixType;

    @Column({ type: 'datetime' })
    createdAt: Date;

    @Column({ type: 'datetime' })
    updatedAt: Date;

    @Column()
    price: number;
}