import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import {Hotel} from './hotels.entity';
import {HotelRooms} from './hotelRooms.entity';
import {HAController} from './hotelAdmin.controller';
import {AuthModule} from '../auth/auth.module';
import {JwtService} from '@nestjs/jwt';
import {HAService} from './hotelAdmin.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Hotel,HotelRooms]),
    forwardRef(() => AuthModule)
  ],
  providers: [JwtService,HAService],
  controllers: [HAController],
})
export class HAModule {}