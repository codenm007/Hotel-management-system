import {IsUrl,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class addAsetsDto  {
    @IsUrl()
    url:string;

    @IsNumber()
    @Type(() => Number)
    hotel_id:number;
}