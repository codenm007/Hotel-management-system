import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {AuthModule} from '../auth/auth.module';
import {JwtService} from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService,JwtService],
  controllers: [UsersController],
})
export class UsersModule {}