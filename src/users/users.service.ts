import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserPrefixType } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(email: string, passwordHash: string,firstName: string,lastName: string,prefix:UserPrefixType,profilePic:string,zip_code:number,cityId:number,stateId:number,dob:Date) {
    const user = this.usersRepository.create({ email, passwordHash, firstName, lastName, prefix, profilePic, zip_code, cityId, stateId, dob });

    return this.usersRepository.save(user);
  }



  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ email} });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
