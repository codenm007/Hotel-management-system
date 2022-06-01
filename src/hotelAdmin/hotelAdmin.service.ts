import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserPrefixType,UserRoleType } from '../users/users.entity';
import { Role } from "../users/dtos/User.dto";
@Injectable()
export class HAService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(email: string, passwordHash: string,firstName: string,lastName: string,prefix:UserPrefixType,profilePic:string,zip_code:number,cityId:number,stateId:number,dob:Date) {
    const roleCode = Role.hotelManager;
    const user = this.usersRepository.create({ email, passwordHash, firstName, lastName, prefix, profilePic, zip_code,roleCode, cityId, stateId, dob });

    return this.usersRepository.save(user);
  }



  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ email,roleCode: Role.hotelManager} });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ id,roleCode: Role.hotelManager} });
  }

  async signup(email: string, password: string,firstName: string,lastName: string,prefix:UserPrefixType,profilePic:string,zip_code:number,cityId:number,stateId:number,dob:Date) {
    // See if email is in use
    const users = await this.findByEmail(email);

    if (users) {
      throw new BadRequestException('This email already in use !');
    }
    const passwordHash = password;

    // Create a new user and save it
    const user = await this.create(email,passwordHash, firstName, lastName,prefix, profilePic,zip_code,cityId,stateId,dob);

    // return the user
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
