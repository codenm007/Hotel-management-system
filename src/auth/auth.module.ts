import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

//user module 
import {UsersModule } from '../users/users.module';
import {UsersService} from '../users/users.service';

//hotel admin module 
import {HAService} from '../hotelAdmin/hotelAdmin.service';
import {HAModule} from '../hotelAdmin/hotelAdmin.module';


import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';


@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    forwardRef(() => HAModule),
    JwtModule.register({
      secret:'6276bb15-3c31-466e-bca2-eb8523d44037',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, JwtStrategy,UsersService,HAService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}