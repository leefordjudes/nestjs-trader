import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService, LoginInput } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthContext } from '../common/global/auth.context';
import { isValidObjectId } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private auth: AuthContext,
  ) {}

  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    if (!this.auth.user || !isValidObjectId(this.auth.user.id)) {
      throw new BadRequestException('Invalid authentication context');
    }
    return await this.authService.findById(this.auth.user.id);
  }
}
