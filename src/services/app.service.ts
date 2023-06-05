import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getABC(): Record<string, any> {
    return { name: 'Hi' };
  }
}
