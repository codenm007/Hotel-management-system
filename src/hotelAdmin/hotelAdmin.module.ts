import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [],
  controllers: [],
})
export class HAModule {}