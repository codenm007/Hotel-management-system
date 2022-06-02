import {IsString,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';
import {FacilitiesPrefixType} from '../hotelRooms.entity';


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

    @IsString()
    facilities:FacilitiesPrefixType;

    @IsNumber()
    @Type(() => Number)
    price:number;
}