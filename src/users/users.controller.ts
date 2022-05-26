
   
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { User } from './users.entity';

//importing services
import { UsersService } from './users.service';
import {AuthService} from '../auth/auth.service';

//importing serializers
import {Serialize} from '../interceptor/serialize.interceptor';
//importing dtos
import {LoginUserDto} from './dtos/LoginUser.dto';
import {CreateUserDto} from './dtos/CreateUser.dto';
import { UserDto } from './dtos/User.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: LoginUserDto) {
    console.log(body);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const {email, password,firstName,lastName,prefix,profilePic,zip_code,dob,stateId,cityId} = body;

    const user = await this.authService.signup(email, password,firstName,lastName,prefix,profilePic,zip_code,cityId,stateId,dob);
    return user;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}