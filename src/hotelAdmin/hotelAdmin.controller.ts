
   
import { Body, Controller, Delete, Get, Param, Post ,Headers, UseGuards } from '@nestjs/common';

//importing services
import { HAService } from './hotelAdmin.service';
import {AuthService} from '../auth/auth.service';
import {JwtService} from '@nestjs/jwt';
//importing serializers
import {Serialize} from '../interceptor/serialize.interceptor';
//importing dtos
import {LoginUserDto} from '../users/dtos/LoginUser.dto';
import {CreateUserDto} from '../users/dtos/CreateUser.dto';
import { UserDto } from '../users/dtos/User.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { Role } from "../users/dtos/User.dto";
import {RoleGuard} from '../guards/role.guard';

@Serialize(UserDto)
@Controller('hoteladmin')
export class HAController {

  constructor(
    private readonly haService: HAService,
    private readonly authService: AuthService,
    private readonly jwtService:JwtService
    ) {}

  @Post("login")
  async login(@Body() body: LoginUserDto) {
    const {email, password} = body;

    const user = await this.authService.validateCreds(email, password,Role.hotelManager);
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const {email, password,firstName,lastName,prefix,profilePic,zip_code,dob,stateId,cityId} = body;

    const user = await this.haService.signup(email, password,firstName,lastName,prefix,profilePic,zip_code,cityId,stateId,dob);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.hotelManager))
  @Get('profile')
  async getProfile(@Headers() headers) {
    const token = headers.authorization.slice(7);
    const userId = this.jwtService.decode(token).sub;

    //console.log(await this.usersService.findById(userId));
    return await this.haService.findById(userId);
  }
}