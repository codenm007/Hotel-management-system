import {IsString,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';



export class addRoomsDto  {

    @IsNumber()
    @Type(() => Number)
    hotel_id:number;

    @IsNumber()
    @Type(() => Number)
    room_type_id:number;

    @IsNumber()
    @Type(() => Number)
    rooms_available:number;

    @IsNumber()
    @Type(() => Number)
    price:number;
}