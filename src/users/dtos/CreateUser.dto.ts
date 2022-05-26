import {IsString,IsDate,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';
import {LoginUserDto} from './LoginUser.dto';

import {UserPrefixType} from '../users.entity';

export class CreateUserDto extends LoginUserDto  {
    @IsString()
    firstName:string;

    @IsString()
    prefix:UserPrefixType;

    @IsString()
    lastName:string;

    @IsDate()
    @Type(() => Date)
    dob:Date;

    @IsString()
    profilePic:string;

    @IsNumber()
    @Type(() => Number)
    zip_code:number;

    @IsNumber()
    @Type(() => Number)
    stateId:number;

    @IsNumber()
    @Type(() => Number)
    cityId:number;
}