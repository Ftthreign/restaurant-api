import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRole } from 'src/users/enums/user-role';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; email: string; role: UserRole },
  ) {
    const user = await this.usersService.findOneById(payload.sub);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (await this.authService.isBlacklisted(token))
      throw new UnauthorizedException('Token is blacklisted');

    if (!user) {
      throw new UnauthorizedException('User not found or unauthorized access');
    }
    return { id: user.id, email: user.email, role: payload.role };
  }
}
