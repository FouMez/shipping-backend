import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { ParcelService } from '../services/parcel.service';
import { Parcel } from '../entities/parcel.entity';

@Controller('parcels')
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  @Post()
  createParcel(@Body() parcel: Omit<Parcel, 'id'>): Promise<Parcel> {
    return this.parcelService.createParcel(parcel);
  }

  @Get()
  findAllParcels(
    @Query('country') country: string,
    @Query('description') description: string,
  ): Promise<Parcel[]> {
    return this.parcelService.findAllParcels(country, description);
  }
}
