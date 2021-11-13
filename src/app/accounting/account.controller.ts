import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AccountService,
  SaveAccountInput,
  SaveAccountPatternInput,
} from '../common/database/services';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: SaveAccountInput) {
    return await this.accountService.create(data);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  async list() {
    return await this.accountService.list();
  }

  @Get('/config')
  @UseGuards(JwtAuthGuard)
  async retriveConfig(@Query('method') method: string) {
    return await this.accountService.retriveConfig(method);
  }

  @Get('/pattern-list')
  @UseGuards(JwtAuthGuard)
  async patternList() {
    return await this.accountService.patternList();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async retrieve(@Param('id') id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException(['Invalid account.']);
    }
    return await this.accountService.retrieve(new Types.ObjectId(id));
  }

  @Put('/:id/apply-pattern')
  @UseGuards(JwtAuthGuard)
  async applyPattern(
    @Param('id') id: string,
    @Body() data: SaveAccountPatternInput,
  ) {
    if (!isMongoId(id)) {
      throw new BadRequestException(['Invalid account.']);
    }
    return await this.accountService.applyPattern(new Types.ObjectId(id), data);
  }

  @Put('/:id/update')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: SaveAccountInput) {
    if (!isMongoId(id)) {
      throw new BadRequestException(['Invalid account.']);
    }
    return await this.accountService.update(new Types.ObjectId(id), data);
  }
}
