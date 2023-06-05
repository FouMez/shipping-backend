import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class QueriableFieldsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { country, description, ...otherQueryParams } = req.query;
    if (Object.keys(otherQueryParams).length > 0) {
      return res.status(400).json({
        message:
          'Only `country` and `description` fields are allowed in the query parameters',
      });
    }
    next();
  }
}
