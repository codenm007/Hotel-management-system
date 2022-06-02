import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController,FindHotelsController } from './users.controller';
import { UsersService } from './users.service';
import {AuthModule} from '../auth/auth.module';
import {JwtService} from '@nestjs/jwt';
import {HAService} from '../hotels/hotels.service';

import {Hotel} from '../hotels/hotels.entity';
import {HotelRooms} from '../hotels/hotelRooms.entity';
import {HotelAssets} from '../hotels/hotelAssets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Hotel,HotelRooms,HotelAssets]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService,JwtService],
  controllers: [UsersController,FindHotelsController],
})
export class UsersModule {}