import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequiredFieldsMiddleware implements NestMiddleware {
  private requiredFields = [
    'sku',
    'description',
    'streetAddress',
    'town',
    'country',
    'deliveryDate',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const missingFields: string[] = [];

    for (const field of this.requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    if (missingFields.length) {
      return res.status(400).json({
        status: 'failure',
        message: 'Required fields are missing.',
        missingFields,
      });
    }
    next();
  }
}
