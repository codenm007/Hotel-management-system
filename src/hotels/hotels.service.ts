import { Injectable,BadRequestException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserPrefixType } from '../users/users.entity';
import {Hotel} from './hotels.entity';
import {HotelRooms,FacilitiesPrefixType} from './hotelRooms.entity';
import { Role } from "../users/dtos/User.dto";
import {HotelAssets} from './hotelAssets.entity';

@Injectable()
export class HAService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelRooms)
    private readonly hotelRoomRepository: Repository<HotelRooms>,
    @InjectRepository(HotelAssets)
    private readonly hotelAssets: Repository<HotelAssets>,
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
    //checking hotel ownwer 
    if(hotel.adminId !== adminId){
      throw new ForbiddenException('Method not allowed !')
    }

    if(await this.findSimilarRoomType(hotel_id,room_type_id)){
      throw new BadRequestException('Similar room choise cannot be added twice!')
    }

    const addHotelRooms = this.hotelRoomRepository.create({hotel_id,room_type_id,rooms_available,facilities,price});
    return this.hotelRoomRepository.save(addHotelRooms);
  }

  async addHotelAssets(adminId: number,hotel_id:number,url:string){
    //checking if correct hotel id admin id is passed 
    const hotel = await this.findHotelById(hotel_id);

    if(!hotel){
      throw new BadRequestException('Invalid hotel id passed');
    }
    //checking hotel ownwer 
    if(hotel.adminId !== adminId){
      throw new ForbiddenException('Method not allowed !')
    }

    const newAsset = this.hotelAssets.create({uploadedBy:adminId,hotelId:hotel_id,url});
    return this.hotelAssets.save(newAsset);

  }

  async getHotelListings(adminId: number){
    //checking if correct hotel id admin id is passed

    const hotels = await this.findAllHotelsByAdminId(adminId);

    const hotelArr =[];

    if(hotels.length){
      for (const hotel of hotels) {
        hotel['rooms'] = await this.findAllRoomsByHotelId(hotel.id);
        hotel['assets'] = await this.findAllAssetsByHotelId(hotel.id);
        hotelArr.push(hotel);
      }
      if(hotelArr.length === hotels.length){
        return hotelArr;
      }
    }else{
      return hotelArr;
    }
  }

  async getHotelsByCity(cityId: number){
    //checking if correct hotel id admin id is passed

    const hotels = await this.findAllHotelsByCityId(cityId);

    const hotelArr =[];

    if(hotels.length){
      for (const hotel of hotels) {
        hotel['Totalrooms'] = await this.findAllRoomsByHotelId(hotel.id);
        hotel['assets'] = await this.findAllAssetsByHotelId(hotel.id);
        hotelArr.push(hotel);
      }
      if(hotelArr.length === hotels.length){
        return hotelArr;
      }
    }else{
      return hotelArr;
    }
  }


  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ email,roleCode: Role.hotelManager} });
  }

  findAllHotelsByAdminId(adminId: number):Promise<Hotel[]> {
    return this.hotelRepository.find(
      { where:{adminId} });
  }

  findAllHotelsByCityId(cityId: number):Promise<Hotel[]> {
    //only showing hotels which are approved and activated by admin 
    return this.hotelRepository.find(
      { where:{cityId,isActive:true,isApproved:true} });
  }

  findAllRoomsByHotelId(hotel_id: number):Promise<HotelRooms[]> {
    return this.hotelRoomRepository.find(
      { where:{hotel_id} });
  }

  findAllAssetsByHotelId(hotel_id: number):Promise<HotelAssets[]> {
    return this.hotelAssets.find(
      { where:{hotelId:hotel_id} });
  }

  findHotelByEmail(email: string): Promise<Hotel> {
    return this.hotelRepository.findOne(
      { where:{ email} });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(
      { where:{ id,roleCode: Role.hotelManager} });
  }

  findSimilarRoomType(hotel_id:number,room_type_id:number): Promise<HotelRooms> {
    
    return this.hotelRoomRepository.findOne(
      { where:{hotel_id,room_type_id} });
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
