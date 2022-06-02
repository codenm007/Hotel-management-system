import { Expose } from 'class-transformer';


export class HotelDto  {
    @Expose()
    name:string;

    @Expose()
    email:string;

    @Expose()
    cityId:number;

    @Expose()
    stateId:number;

    @Expose()
    addrLine1:string;

    @Expose()
    addrLine2:string;

    @Expose()
    zip_code:number;

    @Expose()
    brandPic:string;

    @Expose()
    lat:string;

    @Expose()
    long:string;
}