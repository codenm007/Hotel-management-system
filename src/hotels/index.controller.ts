
   
import { Body, Controller, Delete, Get, Param, Post ,Headers, UseGuards,Query } from '@nestjs/common';

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
import {scrhotelbycity} from './dtos/searchHotelByCity.dto';
import {reserveRoom} from './dtos/reserveRoom.dto';
import {reservations} from './dtos/hotelReservations.dto';

@Controller('hotels')
export class HotelsController {

  constructor(
    private readonly haService: HAService,
    private readonly jwtService:JwtService
    ) {}
  
    @Get()
    async getHotelsBasedOnCity(@Query() query:scrhotelbycity ) {
      const {cityId,check_in,check_out } = query;
  
      return this.haService.getHotelsByCity(cityId,check_in,check_out);
    }  
}

@Controller('hotels/reservations')
export class HotelsReservationsController {
  constructor(
    private readonly haService: HAService,
    private readonly jwtService:JwtService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.User))
    async getAllReservations(@Headers() headers){
      const token = headers.authorization.slice(7);
      const reserved_by = this.jwtService.decode(token).sub;

      return this.haService.getAllReservations(reserved_by);
    }

    @Post('book')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.User))
    async bookHotelRoom(@Headers() headers,@Body() body:reserveRoom){
      const token = headers.authorization.slice(7);
      const reserved_by = this.jwtService.decode(token).sub;
      const {room_id,check_in,check_out,no_of_guest,no_of_rooms} = body;
       
      return this.haService.reserveMyRoom(room_id,check_in,check_out,no_of_guest,no_of_rooms,reserved_by);
    }

    @Post('cancel')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.User))
    async cancelHotelBooking(@Headers() headers,@Body() body:reservations){
      const token = headers.authorization.slice(7);
      const reserved_by = this.jwtService.decode(token).sub;
       const {id} = body;
      return this.haService.cancelUserRoom(id,reserved_by);
    }

    @Post('checkIn')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.User))
    async checkInToHotel(@Headers() headers,@Body() body:reservations){
      const token = headers.authorization.slice(7);
      const reserved_by = this.jwtService.decode(token).sub;
       const {id} = body;
      return this.haService.checkInUserRoom(id,reserved_by);
    }
}


@Controller('hotel/admin')
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

@Controller('hotel/admin/rooms')
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

    @Get('reservations/:hotelId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.hotelManager))
    async getHotelReservations(@Param('hotelId') hotelId){
      return this.haService.getReservationsByHotelId(hotelId);
    }

    @Post('reservations/cancel')
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard(Role.hotelManager))
    async cancelHotelBooking(@Headers() headers,@Body() body:reservations){
      const token = headers.authorization.slice(7);
      const adminId = this.jwtService.decode(token).sub;
       const {id} = body;
      return this.haService.cancelRoomReservationByAdmin(id,adminId);
    }
}

@Controller('hotel/admin/hotelAssets')
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
