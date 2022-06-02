import {IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class scrhotelbycity  {

    @IsNumber()
    @Type(() => Number)
    cityId:number;
}