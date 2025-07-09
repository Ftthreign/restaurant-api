import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      console.log(`User with email ${email} not found`);
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    const decode = this.jwtService.decode(token) as { exp: number };
    const ttl = decode.exp - Math.floor(Date.now() / 1000);

    await this.cacheManager.set(token, 'valid', ttl);
    await this.cacheManager.set('access_token', token, ttl);

    console.log(`Token saved to Redis with TTL: ${ttl} seconds`);
    console.log(`Redis key: ${token}`);
    const val = await this.cacheManager.get(token);
    console.log(`Redis value: ${val}`);

    return {
      access_token: token,
    };
  }

  async blacklistToken(token: string) {
    const decode = this.jwtService.decode(token) as { exp: number };

    if (!decode?.exp) {
      throw new UnauthorizedException('Invalid token');
    }

    const expireIn = decode.exp - Math.floor(Date.now() / 1000);

    await this.cacheManager.set(token, 'blacklisted', expireIn);

    console.log(`Token ${token} blacklisted in Redis for ${expireIn} seconds`);
  }

  async isBlacklisted(token: string | null): Promise<boolean> {
    if (!token) return false;

    const status = await this.cacheManager.get(token);
    return status === 'blacklisted';
  }
}
