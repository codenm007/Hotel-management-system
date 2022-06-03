import {IsDate,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';



export class reserveRoom  {

    @IsNumber()
    @Type(() => Number)
    room_id:number;

    @IsDate()
    @Type(() => Date)
    check_in:Date;

    @IsDate()
    @Type(() => Date)
    check_out:Date;

    @IsNumber()
    @Type(() => Number)
    no_of_guest:number;

    @IsNumber()
    @Type(() => Number)
    no_of_rooms:number;
}