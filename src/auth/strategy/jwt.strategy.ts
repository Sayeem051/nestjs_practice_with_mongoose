import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../../models';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable({})
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('accesstoken'),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    let user = await User.findOne({ _id: payload._id });
    delete user.password;
    return user;
  }
}
