import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPrefixType } from '../users/users.entity';
import { Hotel } from './hotels.entity';
import { HotelRooms, FacilitiesPrefixType } from './hotelRooms.entity';
import { Role } from "../users/dtos/User.dto";
import { HotelAssets } from './hotelAssets.entity';
import { Hotelreservations } from './reservations.entity';
import { LessThan, MoreThan } from "typeorm";

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
    @InjectRepository(Hotelreservations)
    private readonly hotelReservations: Repository<Hotelreservations>,
  ) { }

  create(email: string, passwordHash: string, firstName: string, lastName: string, prefix: UserPrefixType, profilePic: string, zip_code: number, cityId: number, stateId: number, dob: Date) {
    const roleCode = Role.hotelManager;
    const user = this.usersRepository.create({ email, passwordHash, firstName, lastName, prefix, profilePic, zip_code, roleCode, cityId, stateId, dob });

    return this.usersRepository.save(user);
  }

  listMyHotel(adminId: number, name: string, email: string, cityId: number, stateId: number, addrLine1: string, addrLine2: string, zip_code: number, brandPic?: string, lat?: string, long?: string) {
    //checking if the admin id is valid or not
    const admin = this.findById(adminId);
    if (!admin) {
      throw new BadRequestException('Invalid admin id passed');
    }

    //checking if hotel with same email exist 
    const hotel = this.findHotelByEmail(email);
    if (hotel) {
      throw new BadRequestException('Hotel listing with same email already exist !');
    }

    const newHotel = this.hotelRepository.create({ adminId, name, email, cityId, stateId, addrLine1, addrLine2, zip_code, brandPic, lat, long });
    return this.hotelRepository.save(newHotel);

  }

  async cancelRoomReservationByAdmin(booking_id: number,admin_id: number) {
    //checking if rooms are available for that date range 
    const getReservation = await this.hotelReservations.findOne({ 
      where: {id: booking_id,is_canceled:false,checkedin:false}
    })
    if(!getReservation){
      throw new BadRequestException('Room already canceled !'); 
    }

    //check if admin is the owner of that room 
    const roomId = getReservation.room_id;
    const getHotelId = await (await this.hotelRoomRepository.findOne({where:{id:roomId},select:["hotel_id"]})).hotel_id;
    const getHotelAdminId = await (await this.hotelRepository.findOne({where:{id:getHotelId}})).adminId
    if(admin_id !== getHotelAdminId){
      throw new BadRequestException('You dont have the required access !'); 
    }
    getReservation.is_canceled = true;
    return this.hotelReservations.save(getReservation);

  }

  async getReservationsByHotelId(hotel_id: number) {
    //checking if rooms are available for that date range 
    const hotelRooms = await this.hotelRoomRepository.find({where:{hotel_id},select:["id"]});
    const HotelRoomReservation = [];
    if(hotelRooms.length){
    for(const room of hotelRooms) {
      const reservations = await this.hotelReservations.find({where:{room_id:room.id}});
      HotelRoomReservation.push(reservations);
    }
  }
    return HotelRoomReservation;

  }

  async reserveMyRoom(room_id: number, check_in: Date, check_out: Date, no_of_guest: number, no_of_rooms: number, reserved_by: number) {
    //checking if rooms are available for that date range 
    const freeRooms = await this.getEmptyRooms(room_id, check_in, check_out);
    //if hotel is out of rooms then throwing error
    if (freeRooms < no_of_rooms) {
      throw new BadRequestException('We are sorry , we dont have enough rooms now , please come back later !')
    }

    //if no of guest excedds then throwing error , assuming max person per room to be 3
    if (no_of_guest > 3) {
      throw new BadRequestException('Max 3 pax available per room !')
    }

    //creating a new reservation 
    const newReservation = this.hotelReservations.create({ check_in, check_out, room_id, no_of_guest, no_of_rooms, reserved_by });

    return this.hotelReservations.save(newReservation);

  }

  async cancelUserRoom(id: number,reserved_by: number) {
    //checking if rooms are available for that date range 
    const getReservation = await this.hotelReservations.findOne({ 
      where: {reserved_by,id,is_canceled:false,checkedin:false}
    })
    if(!getReservation){
      throw new BadRequestException('Room already canceled !'); 
    }
    getReservation.is_canceled = true;
    return this.hotelReservations.save(getReservation);

  }

  async checkInUserRoom(id: number,reserved_by: number) {
    //checking if rooms are available for that date range 
    const getReservation = await this.hotelReservations.findOne({ 
      where: {reserved_by,id,is_canceled:false,checkedin:false}
    })
    if(!getReservation){
      throw new BadRequestException('Room already checkedIn !'); 
    }
    getReservation.checkedin = true;
    return this.hotelReservations.save(getReservation);

  }

  async getAllReservations(reserved_by: number) {
    // get all user reservations
    return await this.hotelReservations.find({ 
      where: {reserved_by}
    })
  }

  async addHotelRooms(adminId: number, hotel_id: number, room_type_id: number, rooms_available: number, facilities: FacilitiesPrefixType, price: number) {
    //checking if correct hotel id admin id is passed 
    const hotel = await this.findHotelById(hotel_id);

    if (!hotel) {
      throw new BadRequestException('Invalid hotel id passed');
    }
    //checking hotel ownwer 
    if (hotel.adminId !== adminId) {
      throw new ForbiddenException('Method not allowed !')
    }

    if (await this.findSimilarRoomType(hotel_id, room_type_id)) {
      throw new BadRequestException('Similar room choise cannot be added twice!')
    }

    const addHotelRooms = this.hotelRoomRepository.create({ hotel_id, room_type_id, rooms_available, facilities, price });
    return this.hotelRoomRepository.save(addHotelRooms);
  }

  async addHotelAssets(adminId: number, hotel_id: number, url: string) {
    //checking if correct hotel id admin id is passed 
    const hotel = await this.findHotelById(hotel_id);

    if (!hotel) {
      throw new BadRequestException('Invalid hotel id passed');
    }
    //checking hotel ownwer 
    if (hotel.adminId !== adminId) {
      throw new ForbiddenException('Method not allowed !')
    }

    const newAsset = this.hotelAssets.create({ uploadedBy: adminId, hotelId: hotel_id, url });
    return this.hotelAssets.save(newAsset);

  }

  async getHotelListings(adminId: number) {
    //checking if correct hotel id admin id is passed

    const hotels = await this.findAllHotelsByAdminId(adminId);

    const hotelArr = [];

    if (hotels.length) {
      for (const hotel of hotels) {
        hotel['rooms'] = await this.findAllRoomsByHotelId(hotel.id);
        hotel['assets'] = await this.findAllAssetsByHotelId(hotel.id);
        hotelArr.push(hotel);
      }
      if (hotelArr.length === hotels.length) {
        return hotelArr;
      }
    } else {
      return hotelArr;
    }
  }

  async getEmptyRooms(room_id: number, check_in: Date, check_out: Date) {
    let totalBookedRooms = 0;
    //checking if correct hotel id admin id is passed
    const bookedRooms = await this.hotelReservations.find({
      where: {
        room_id,
        is_canceled: false,
        check_out: MoreThan(new Date(check_in)),
        check_in: LessThan(new Date(check_out))
      },
      select: ["no_of_rooms", "checkedin"]
    })

    if (bookedRooms.length) {
      for (const room of bookedRooms) {
        totalBookedRooms += room.no_of_rooms;
      }
    }

    //checking total rooms available
    const getTotalRoomsAvailable = await this.hotelRoomRepository.findOne({
      where: { id: room_id },
      select: ["rooms_available"]
    })

    const TotalRooms = getTotalRoomsAvailable.rooms_available;

    //result = total - bookedRooms
    return TotalRooms - totalBookedRooms;
  }

  async getHotelsByCity(cityId: number, check_in: Date, check_out: Date) {
    //not allowing history data , restricting checkin date to be more than today

    if(new Date(check_in) <= new Date()){
      throw new BadRequestException('CheckIn cannot be in a past date !');
    }

    if(new Date(check_in) > new Date(check_out)){
      throw new BadRequestException('You cannot check out before you checked in !');
    }

    const hotels = await this.findAllHotelsByCityId(cityId);

    const hotelArr = [];

    if (hotels.length) {
      for (const hotel of hotels) {
        const totalRooms = await this.findAllRoomsByHotelId(hotel.id);
        hotel['rooms'] = [];
        if (totalRooms.length) {
          for (const room of totalRooms) {
            const emptyRoomsAvailable = await this.getEmptyRooms(room.id, check_in, check_out);
            const roomData = {
              room_type_id: room.id,
              totalRooms: room.rooms_available,
              availableRooms: emptyRoomsAvailable
            }

            hotel['rooms'].push(roomData);
          }
        }
        hotel['assets'] = await this.findAllAssetsByHotelId(hotel.id);
        hotelArr.push(hotel);
      }
      if (hotelArr.length === hotels.length) {
        return hotelArr;
      }
    } else {
      return hotelArr;
    }
  }


  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne(
      { where: { email, roleCode: Role.hotelManager } });
  }


  findAllHotelsByAdminId(adminId: number): Promise<Hotel[]> {
    return this.hotelRepository.find(
      { where: { adminId } });
  }

  findAllHotelsByCityId(cityId: number): Promise<Hotel[]> {
    //only showing hotels which are approved and activated by admin 
    return this.hotelRepository.find(
      { where: { cityId, isActive: true, isApproved: true } });
  }

  findAllRoomsByHotelId(hotel_id: number): Promise<HotelRooms[]> {
    return this.hotelRoomRepository.find(
      { where: { hotel_id } });
  }

  async findRoomsByHotelId(hotel_id: number) {
    const data = await this.hotelRoomRepository.findOne(
      { where: { hotel_id }, select: ["rooms_available"] });
    console.log(data);
    return data;

  }

  findAllAssetsByHotelId(hotel_id: number): Promise<HotelAssets[]> {
    return this.hotelAssets.find(
      { where: { hotelId: hotel_id } });
  }

  findHotelByEmail(email: string): Promise<Hotel> {
    return this.hotelRepository.findOne(
      { where: { email } });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(
      { where: { id, roleCode: Role.hotelManager } });
  }

  findSimilarRoomType(hotel_id: number, room_type_id: number): Promise<HotelRooms> {

    return this.hotelRoomRepository.findOne(
      { where: { hotel_id, room_type_id } });
  }

  findHotelById(id: number): Promise<Hotel> {
    return this.hotelRepository.findOne(
      { where: { id } });
  }

  async signup(email: string, password: string, firstName: string, lastName: string, prefix: UserPrefixType, profilePic: string, zip_code: number, cityId: number, stateId: number, dob: Date) {
    // See if email is in use
    const users = await this.findByEmail(email);

    if (users) {
      throw new BadRequestException('This email already in use !');
    }
    const passwordHash = password;

    // Create a new user and save it
    const user = await this.create(email, passwordHash, firstName, lastName, prefix, profilePic, zip_code, cityId, stateId, dob);

    // return the user
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
