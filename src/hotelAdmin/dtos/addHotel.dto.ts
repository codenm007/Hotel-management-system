import {IsString,IsNumber,IsEmail} from 'class-validator';
import { Type } from 'class-transformer';


export class addHotelDto  {
    @IsString()
    name:string;

    @IsEmail()
    email:string;

    @IsNumber()
    @Type(() => Number)
    cityId:number;

    @IsNumber()
    @Type(() => Number)
    stateId:number;

    @IsString()
    addrLine1:string;

    @IsString()
    addrLine2:string;

    @IsNumber()
    @Type(() => Number)
    zip_code:number;

    @IsString()
    brandPic:string;

    @IsString()
    lat:string;

    @IsString()
    long:string;
}