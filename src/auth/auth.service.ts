import {
    Injectable,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { UsersService } from '../users/users.service';
  import {UserPrefixType} from '../users/users.entity';
  
  @Injectable()
  export class AuthService {
    constructor(private usersService: UsersService) {}
  
    async signup(email: string, password: string,firstName: string,lastName: string,prefix:UserPrefixType,profilePic:string,zip_code:number,cityId:number,stateId:number,dob:Date) {
      // See if email is in use
      const users = await this.usersService.findByEmail(email);
  
      if (users) {
        throw new BadRequestException('This email already in use !');
      }
      const passwordHash = password;
  
      // Create a new user and save it
      const user = await this.usersService.create(email,passwordHash, firstName, lastName,prefix, profilePic,zip_code,cityId,stateId,dob);
  
      // return the user
      return user;
    }
  
    // async signin(email: string, password: string) {
    //   const [user] = await this.usersService.find(email);
    //   if (!user) {
    //     throw new NotFoundException('user not found');
    //   }
  
    //   const [salt, storedHash] = user.password.split('.');
  
    //   const hash = (await scrypt(password, salt, 32)) as Buffer;
  
    //   if (storedHash !== hash.toString('hex')) {
    //     throw new BadRequestException('bad password');
    //   }
  
    //   return user;
    // }
  }
  