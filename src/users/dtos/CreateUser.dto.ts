import {IsString,IsDate,IsNumber} from 'class-validator';

import {LoginUserDto} from './LoginUser.dto';

export class CreateUserDto extends LoginUserDto  {
    @IsString()
    firstName:string;

    @IsString()
    lastName:string;

    @IsDate()
    dob:Date;

    @IsString()
    profilePic:string;

    @IsNumber()
    zip_code:number;
}