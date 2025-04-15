import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from 'src/user/users.service'; // Make sure this path is correct

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      secretOrKey: 'your-secret-key', // This should be a strong secret in production
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts token from the Authorization header
    });
  }

  // Move validate method here (outside the constructor)
  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub); // Get the user based on the payload sub
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user; // Return user info, so it can be added to the request
  }
}
