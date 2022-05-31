import {
    Injectable,
    BadRequestException,
    UseGuards,
    ForbiddenException,
    Inject,
    forwardRef
  } from '@nestjs/common';
  import { UsersService } from '../users/users.service';
  import {UserPrefixType} from '../users/users.entity';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';

  @Injectable()
  export class AuthService {
    constructor(
      @Inject(forwardRef(() => UsersService))
      private usersService: UsersService,
      private jwtService: JwtService
      ) {}

  
    async validateCreds(email: string, password: string) {
      const user = await this.usersService.findByEmail(email);

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
  