import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {AuthService} from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService,AuthService],
  controllers: [UsersController],
})
export class UsersModule {}