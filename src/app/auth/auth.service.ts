import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IsNotEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginInput) {
    const user = await this.findByAccessId(data.accessId);
    if (user.accessKey !== data.accessKey) {
      throw new BadRequestException('Invalid Credentials');
    }
    return {
      token: await this.jwtService.signAsync(
        { uid: user.id.toString() },
        { expiresIn: '24hr' },
      ),
    };
  }

  async findByAccessId(accessId: string) {
    const user = await this.db.userModel.findOne({ accessId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result: UserResult = {
      id: user._id,
      accessId: user.accessId,
      accessKey: user.accessKey,
    };
    return result;
  }

  async findById(id: Types.ObjectId) {
    const user = await this.db.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result: UserResult = {
      id: user._id,
      accessId: user.accessId,
      accessKey: user.accessKey,
    };
    return result;
  }
}

export class LoginInput {
  @IsNotEmpty()
  accessId: string;

  @IsNotEmpty()
  accessKey: string;
}

export interface LoginResult {
  token: string;
}

export interface UserResult {
  id: Types.ObjectId;
  accessId: string;
  accessKey: string;
}
