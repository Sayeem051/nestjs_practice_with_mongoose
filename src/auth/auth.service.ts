import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/user/dto';
import { User } from '../../models';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private jwt: JwtService, private config: ConfigService) {}
  signup = async (dto: AuthDto) => {
    try {
      dto.password = await bcrypt.hash(dto.password, 8);
      let userExists = await User.findOne({ email: dto.email });
      if (userExists) throw Error('User already exists!');
      let user = await new User(dto).save();
      if (!user) throw Error('Could not save user');
      let tokens = this.generateJwtToken(user);
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully signed up!',
        data: tokens,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  };

  async signin(dto: AuthDto) {
    try {
      let user = await User.findOne({ email: dto.email });
      if (!user) throw Error('User not found!');

      let pass = await bcrypt.compare(dto.password, user.password);
      if (!pass) throw Error('Password did not match!');
      let tokens = this.generateJwtToken(user);
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully signed in!',
        data: tokens,
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  }

  generateJwtToken(user: UserDto): object {
    let payload = {
      _id: user._id,
      email: user.email,
    };
    let secret = this.config.get('JWT_SECRET');
    let token = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
