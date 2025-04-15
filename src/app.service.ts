import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  // constructor(config: ConfigService) {}

  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      console.warn(
        'JWT_SECRET is not defined in the environment.  This is insecure!',
      );
      return 'JWT_SECRET not configured!'; // Or throw an error, depending on your needs
    }

    return `The JWT secret is: ${jwtSecret}`;
  }
}
