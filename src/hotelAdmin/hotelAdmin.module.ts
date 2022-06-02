import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import {Hotel} from './hotels.entity';
import {HotelRooms} from './hotelRooms.entity';
import {HotelAssets} from './hotelAssets.entity';
import {HAController,HotelAssetsController,HotelRoomsController} from './index.controller';
import {AuthModule} from '../auth/auth.module';
import {JwtService} from '@nestjs/jwt';
import {HAService} from './hotelAdmin.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Hotel,HotelRooms,HotelAssets]),
    forwardRef(() => AuthModule)
  ],
  providers: [JwtService,HAService],
  controllers: [HAController,HotelAssetsController,HotelRoomsController],
})
export class HAModule {}