
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity("hotel_pics")
export class HotelAssets {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: "integer" })
    uploadedBy: number;

    @Column({ type: "integer" })
    hotelId: number;

    @Column()
    url: string;

    @Column({ type: 'datetime' })
    createdAt: Date;
}