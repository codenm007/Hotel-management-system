import { Injectable,BadRequestException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserPrefixType } from '../users/users.entity';
import {Hotel} from './hotels.entity';
import {HotelRooms,FacilitiesPrefixType} from './hotelRooms.entity';
import { Role } from "../users/dtos/User.dto";


@Injectable()
export class HAService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelRooms)
    private readonly hotelRoomRepository: Repository<HotelRooms>,
  ) {}

  create(email: string, passwordHash: string,firstName: string,lastName: string,prefix:UserPrefixType,profilePic:string,zip_code:number,cityId:number,stateId:number,dob:Date) {
    const roleCode = Role.hotelManager;
    const user = this.usersRepository.create({ email, passwordHash, firstName, lastName, prefix, profilePic, zip_code,roleCode, cityId, stateId, dob });

    return this.usersRepository.save(user);
  }

  listMyHotel(adminId: number,name:string,email:string,cityId:number,stateId:number,addrLine1:string,addrLine2:string,zip_code:number,brandPic?:string,lat?:string,long?:string){
    //checking if the admin id is valid or not
    const admin = this.findById(adminId);
    if(!admin){
      throw new BadRequestException('Invalid admin id passed');
    }
    
    //checking if hotel with same email exist 
    const hotel = this.findHotelByEmail(email);
    if(hotel){
      throw new BadRequestException('Hotel listing with same email already exist !');
    }

    const newHotel = this.hotelRepository.create({adminId,name,email,cityId,stateId,addrLine1,addrLine2,zip_code,brandPic,lat,long});
    return this.hotelRepository.save(newHotel);

  }

  async addHotelRooms(adminId: number,hotel_id:number,room_type_id:number,rooms_available:number,facilities:FacilitiesPrefixType,price:number){
    //checking if correct hotel id admin id is passed 
    const hotel = await this.findHotelById(hotel_id);

    if(!hotel){
      throw new BadRequestException('Invalid hotel id passed');
    }
    if(hotel.adminId !== adminId){
      throw new ForbiddenException('Method not allowed !')
    }

    const addHotelRooms = this.hotelRoomRepository.create({hotel_id,room_type_id,rooms_available,facilities,price});
    return this.hotelRoomRepository.save(addHotelRooms);
  }



  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ email,roleCode: Role.hotelManager} });
  }

  findHotelByEmail(email: string): Promise<Hotel> {
    return this.hotelRepository.findOne(
      { where:{ email} });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ id,roleCode: Role.hotelManager} });
  }

  findHotelById(id: number): Promise<Hotel> {
    return this.hotelRepository.findOne(
      { where:{ id} });
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
