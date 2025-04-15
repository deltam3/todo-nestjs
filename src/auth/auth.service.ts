import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/user/users.service';
// import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userService.create({
      ...dto,
      password: hash,
    });

    // delete newUser.password;

    return this.signToken(newUser.id, newUser.username);

    // return newUser;
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.userService.findByUserName(dto.username);
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('유저네임 틀림');
    }
    // compare password
    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) {
      throw new ForbiddenException('비밀번호 틀림');
    }

    return this.signToken(user.id, user.username);
    // if password incorrect throw exception
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      // expiresIn: '1m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}

// async validateUse(username: string, password: string): Promise<any> {
// const user = await this.userService.findByUsername(username);
// if (user && bcrypt.compareSync(password, user.password)) {
//   const { password, ...result } = user;
//   return result;
// }
// return null;
// }

// async login(user: any) {
// const payload: JwtPayload = { username: user.username, sub: user.id };
// return {
//   access_token: this.jwtService.sign(payload),
// };
// }
