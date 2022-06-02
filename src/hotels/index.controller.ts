
   
import { Body, Controller, Delete, Get, Param, Post ,Headers, UseGuards } from '@nestjs/common';

//importing services
import { HAService } from './hotels.service';
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
import {addRoomsDto} from './dtos/addRooms.dto';
import {addAsetsDto} from './dtos/addAsset.dto';
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

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.hotelManager))
  @Get()
  async getAllHotelListings(@Headers() headers) {
    const token = headers.authorization.slice(7);
    const userId = this.jwtService.decode(token).sub;
    return await this.haService.getHotelListings(userId);
  }

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

@Controller('hoteladmin/rooms')
export class HotelRoomsController{
  constructor(
    private readonly haService: HAService,
    private readonly jwtService:JwtService
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.hotelManager))
    @Post()
    async addRooms(@Headers() headers,@Body() body:addRoomsDto){
      const token = headers.authorization.slice(7);
      const adminId = this.jwtService.decode(token).sub;
  
       const {hotel_id,room_type_id,rooms_available,facilities,price} = body;
  
       return this.haService.addHotelRooms(adminId,hotel_id,room_type_id,rooms_available,facilities,price);
  
    }
}

@Controller('hoteladmin/hotelAssets')
export class HotelAssetsController{
  constructor(
    private readonly haService: HAService,
    private readonly jwtService:JwtService
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.hotelManager))
    @Post()
    async addAsset(@Headers() headers,@Body() body:addAsetsDto){
      const token = headers.authorization.slice(7);
      const adminId = this.jwtService.decode(token).sub;
  
       const {url,hotel_id} = body;
  
       return this.haService.addHotelAssets(adminId,hotel_id,url);
  
    }
}