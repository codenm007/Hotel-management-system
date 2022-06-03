import {IsDate,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';



export class reservations  {

    @IsNumber()
    @Type(() => Number)
    id:number;
}