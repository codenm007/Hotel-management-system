
   
import { Body, Controller, Delete, Get, Param, Post ,Headers, UseGuards } from '@nestjs/common';

import { User } from './users.entity';
import {Hotel} from '../hotels/hotels.entity';

//importing services
import {HAService} from '../hotels/hotels.service';
import { UsersService } from './users.service';
import {AuthService} from '../auth/auth.service';
import {JwtService} from '@nestjs/jwt';
//importing serializers
import {Serialize} from '../interceptor/serialize.interceptor';
//importing dtos
import {LoginUserDto} from './dtos/LoginUser.dto';
import {CreateUserDto} from './dtos/CreateUser.dto';
import { UserDto } from './dtos/User.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { Role } from "../users/dtos/User.dto";
import {RoleGuard} from '../guards/role.guard';

@Serialize(UserDto)
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService:JwtService
    ) {}

  @Post("login")
  async login(@Body() body: LoginUserDto) {
    const {email, password} = body;

    const user = await this.authService.validateCreds(email, password,Role.User);
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const {email, password,firstName,lastName,prefix,profilePic,zip_code,dob,stateId,cityId} = body;

    const user = await this.usersService.signup(email, password,firstName,lastName,prefix,profilePic,zip_code,cityId,stateId,dob);
    return user;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.User))
  @Get('profile')
  async getProfile(@Headers() headers) {
    const token = headers.authorization.slice(7);
    const userId = this.jwtService.decode(token).sub;

    //console.log(await this.usersService.findById(userId));
    return await this.usersService.findById(userId);
  }

}

@Controller('users/hotel')
export class FindHotelsController {
  constructor(
    private readonly usersService: UsersService,
    ) {}

    @Get()
    findAll(): Promise<Hotel[]> {
      return this.usersService.findAll();
    }
}