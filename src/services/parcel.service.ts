import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Parcel } from '../entities/parcel.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParcelService {
  constructor(
    @InjectRepository(Parcel)
    private readonly parcelRepository: Repository<Parcel>,
  ) {}

  async createParcel(parcelData: Partial<Parcel>): Promise<Parcel> {
    const parcel = this.parcelRepository.create(parcelData);
    return await this.parcelRepository.save(parcel);
  }

  async findAllParcels(
    country: string | undefined,
    description: string | undefined,
  ): Promise<Parcel[]> {
    const queryBuilder = this.parcelRepository.createQueryBuilder('parcel');

    if (country) {
      queryBuilder.where('parcel.country = :country', { country });
    }
    if (description) {
      queryBuilder.andWhere('parcel.description LIKE :description', {
        description: `%${description}%`,
      });
    }

    queryBuilder
      .orderBy(`parcel.country = 'Estonia'`, 'DESC')
      .addOrderBy('parcel.deliveryDate', 'ASC');

    return queryBuilder.getMany();
  }

  async findBySku(sku: string): Promise<Parcel> {
    return this.parcelRepository.findOneBy({ sku });
  }
}
