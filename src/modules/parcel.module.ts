import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelController } from '../controllers/parcel.controller';
import { Parcel } from '../entities/parcel.entity';
import { DuplicateSkuMiddleware } from '../middlewares/duplicate-sku.middleware';
import { ParcelService } from '../services/parcel.service';
import { RequiredFieldsMiddleware } from '../middlewares/required-fields.middleware';
import { QueriableFieldsMiddleware } from '../middlewares/queriable-fields.middleware';
import { ROUTES } from '../config/consts.config';

@Module({
  imports: [TypeOrmModule.forFeature([Parcel])],
  controllers: [ParcelController],
  providers: [ParcelService],
})
export class ParcelModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequiredFieldsMiddleware, DuplicateSkuMiddleware)
      .forRoutes({ path: ROUTES.PARCELS, method: RequestMethod.POST });
    consumer
      .apply(QueriableFieldsMiddleware)
      .forRoutes({ path: ROUTES.PARCELS, method: RequestMethod.GET });
  }
}
