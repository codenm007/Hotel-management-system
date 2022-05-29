import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule)
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}