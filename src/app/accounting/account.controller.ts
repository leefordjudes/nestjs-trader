import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';

import { AccountService, SaveAccountInput } from '../common/database/services';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/create')
  async create(@Body() data: SaveAccountInput) {
    return await this.accountService.create(data);
  }

  @Put('/:id/update')
  async update(@Param('id') id: string, @Body() data: SaveAccountInput) {
    if (!isMongoId(id)) {
      throw new BadRequestException(['Invalid account.']);
    }
    return await this.accountService.update(new Types.ObjectId(id), data);
  }

  @Get('/list')
  async list() {
    return await this.accountService.list();
  }

  @Get('/:id')
  async retrieve(@Param('id') id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException(['Invalid account.']);
    }
    return await this.accountService.retrieve(new Types.ObjectId(id));
  }
}
