import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {UsersModule } from '../users/users.module';
import {UsersService} from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret:"123456",
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService, JwtStrategy,UsersService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}