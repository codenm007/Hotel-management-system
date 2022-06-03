import {IsNumber,IsDate} from 'class-validator';
import { Type } from 'class-transformer';

export class scrhotelbycity  {

    @IsNumber()
    @Type(() => Number)
    cityId:number;

    @IsDate()
    @Type(() => Date)
    check_in:Date;

    @IsDate()
    @Type(() => Date)
    check_out:Date;
}