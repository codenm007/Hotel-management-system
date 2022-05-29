
   
import { Body, Controller, Delete, Get, Param, Post ,Request, UseGuards } from '@nestjs/common';

import { User } from './users.entity';

//importing services
import { UsersService } from './users.service';
import {AuthService} from '../auth/auth.service';
//importing serializers
import {Serialize} from '../interceptor/serialize.interceptor';
//importing dtos
import {LoginUserDto} from './dtos/LoginUser.dto';
import {CreateUserDto} from './dtos/CreateUser.dto';
import { UserDto } from './dtos/User.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Serialize(UserDto)
@Controller('users')
export class UsersController {

  constructor(
    // @Inject(forwardRef(() => AuthService))
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    ) {}

  @Post("login")
  async login(@Body() body: LoginUserDto) {
    const {email, password} = body;

    const user = await this.authService.validateCreds(email, password);
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const {email, password,firstName,lastName,prefix,profilePic,zip_code,dob,stateId,cityId} = body;

    const user = await this.usersService.signup(email, password,firstName,lastName,prefix,profilePic,zip_code,cityId,stateId,dob);
    return user;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile() {
  //   this.jwtService.dec
  //   return {

  //   }
  // }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}