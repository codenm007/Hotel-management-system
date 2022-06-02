
   
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
import {addHotelDto} from './dtos/addHotel.dto';
import {HotelDto} from './dtos/hotel.dto';
import {RoleGuard} from '../guards/role.guard';


@Controller('hoteladmin')
export class HAController {

  constructor(
    private readonly haService: HAService,
    private readonly authService: AuthService,
    private readonly jwtService:JwtService
    ) {}
  
  @Serialize(UserDto)
  @Post("login")
  async login(@Body() body: LoginUserDto) {
    const {email, password} = body;

    const user = await this.authService.validateCreds(email, password,Role.hotelManager);
    return user;
  }

  @Serialize(UserDto)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const {email, password,firstName,lastName,prefix,profilePic,zip_code,dob,stateId,cityId} = body;

    const user = await this.haService.signup(email, password,firstName,lastName,prefix,profilePic,zip_code,cityId,stateId,dob);
    return user;
  }

  //authenticated routes
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.hotelManager))
  @Get('profile')
  async getProfile(@Headers() headers) {
    const token = headers.authorization.slice(7);
    const userId = this.jwtService.decode(token).sub;
    return await this.haService.findById(userId);
  }

  @Serialize(HotelDto)
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.hotelManager))
  @Post('listmyhotel')
  async listMyHotel(@Headers() headers,@Body() body: addHotelDto){
    const token = headers.authorization.slice(7);
    const adminId = this.jwtService.decode(token).sub;

     const {name,email,cityId,stateId,addrLine1,addrLine2,zip_code,brandPic,lat,long} = body;

     return this.haService.listMyHotel(adminId,name,email,cityId,stateId,addrLine1,addrLine2,zip_code,brandPic,lat,long);

  }
}