import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ParcelService } from '../services/parcel.service';

@Injectable()
export class DuplicateSkuMiddleware implements NestMiddleware {
  constructor(private readonly parcelService: ParcelService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { sku } = req.body;
    const existingParcel = await this.parcelService.findBySku(sku);

    if (existingParcel) {
      return res
        .status(400)
        .send({ status: 'failure', message: 'Duplicate SKU are not allowed.' });
    }

    next();
  }
}
