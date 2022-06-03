import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import {Hotel} from './hotels.entity';
import {HotelRooms} from './hotelRooms.entity';
import {HotelAssets} from './hotelAssets.entity';
import {Hotelreservations} from './reservations.entity';
import {HAController,HotelAssetsController,HotelRoomsController,HotelsController,HotelsReservationsController} from './index.controller';
import {AuthModule} from '../auth/auth.module';
import {JwtService} from '@nestjs/jwt';
import {HAService} from './hotels.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Hotel,HotelRooms,HotelAssets,Hotelreservations,]),
    forwardRef(() => AuthModule)
  ],
  providers: [JwtService,HAService],
  controllers: [HotelsController,HAController,HotelAssetsController,HotelRoomsController,HotelsReservationsController],
})
export class HAModule {}