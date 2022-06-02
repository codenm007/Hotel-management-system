import {
    Injectable,
    BadRequestException,
    UseGuards,
    ForbiddenException,
    Inject,
    forwardRef
  } from '@nestjs/common';
  import { UsersService } from '../users/users.service';
  import { HAService } from '../hotels/hotels.service';
  import {UserPrefixType} from '../users/users.entity';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';
  import { Role } from "../users/dtos/User.dto";

  @Injectable()
  export class AuthService {
    constructor(
      @Inject(forwardRef(() => UsersService))
      private usersService: UsersService,
      private haService: HAService,
      private jwtService: JwtService
      ) {}

  
    async validateCreds(email: string, password: string,role:string) {
      let user;
      if(role === Role.User){
        //searching in new users
         user = await this.usersService.findByEmail(email);
      }else if(role === Role.hotelManager){
        //searching in hotel admins users
        user = await this.haService.findByEmail(email);
      }else{
        throw new ForbiddenException('Method not allowed');
      }
      

      if (!user) {
        throw new ForbiddenException('Incorrect email or password !');
      }
      
      const isPasswordMatch = await bcrypt.compare(password,user.passwordHash);

      if(!isPasswordMatch){
        throw new ForbiddenException('Incorrect email or password !');
      }else{
        const payload = { username: user.email, sub: user.id, role: user.roleCode};
        return {
          accessToken: this.jwtService.sign(payload),
        };
      }
    }    
  }
  