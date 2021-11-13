import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IsEnum, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

import { DatabaseService } from '../database.service';
import { Account } from '../schemas';
import { crossValidateCondition, textFormatter } from '../../util';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

@Injectable()
export class AccountService {
  constructor(private db: DatabaseService) {}
  async create(data: SaveAccountInput) {
    const validateExistence = async (acc: Account) => {
      const crossCondition = crossValidateCondition(acc, ['validateName']);
      const dupe = await this.db.accountModel.findOne({ $or: crossCondition });
      if (dupe) {
        throw new BadRequestException(['Account already exist']);
      }
    };
    const account = new Account({
      name: data.name,
      validateName: textFormatter(data.name),
      pattern: data.pattern,
      config: data.config,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await validateExistence(account);
    const savedAccount = await this.db.accountModel.create(account);
    const result: SaveRetrieveAccountOutput = {
      id: savedAccount._id.toString(),
      name: savedAccount.name,
      pattern: savedAccount.pattern,
      config: savedAccount.config,
    };
    return result;
  }

  private async findById(id: Types.ObjectId) {
    const result = this.db.accountModel.findById(id);
    if (!result) {
      throw new BadRequestException('Invalid Account');
    }
    return result;
  }

  async update(id: Types.ObjectId, data: SaveAccountInput) {
    const validateExistence = async (acc: Account) => {
      const crossCondition = crossValidateCondition(acc, ['validateName']);
      const dupe = await this.db.accountModel.findOne({
        $and: [{ _id: { $ne: id } }, { $or: crossCondition }],
      });
      if (dupe) {
        throw new BadRequestException(['Account already exist']);
      }
    };
    const account = await this.findById(id);
    account.name = data.name;
    account.validateName = textFormatter(data.name);
    account.pattern = data.pattern;
    account.config = data.config;
    account.updatedAt = new Date();
    await validateExistence(account);
    const updatedAccount = await this.db.accountModel.findOneAndUpdate(
      { _id: id },
      account,
      {
        new: true,
        overwrite: true,
        runValidators: true,
      },
    );
    if (!updatedAccount) {
      throw new NotFoundException(['Account Not Found']);
    }
    const result: SaveRetrieveAccountOutput = {
      id: updatedAccount.id,
      name: updatedAccount.name,
      pattern: updatedAccount.pattern,
      config: updatedAccount.config,
    };
    return result;
  }

  async retrieve(id: Types.ObjectId) {
    const account = await this.findById(id);
    const result: SaveRetrieveAccountOutput = {
      id: account.id,
      name: account.name,
      pattern: account.pattern,
      config: account.config,
    };
    return result;
  }
}

export enum AccountPattern {
  M1 = 'M1',
  M2 = 'M2',
}

class m1ConfigData {
  @IsNotEmpty()
  jump: number;

  @IsNotEmpty()
  init: number;

  @IsNotEmpty()
  threshold: number;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  five: number;

  @IsNotEmpty()
  m1: number;
}

class m2ConfigData {
  @IsNotEmpty()
  jump: number;

  @IsNotEmpty()
  init: number;

  @IsNotEmpty()
  threshold: number;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  five: number;

  @IsNotEmpty()
  m2: number;
}

export class SaveAccountInput {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEnum(AccountPattern, { message: 'Invalid pattern selected' })
  pattern: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type((val) =>
    val.object['pattern'] === AccountPattern.M1 ? m1ConfigData : m2ConfigData,
  )
  config: m1ConfigData | m2ConfigData;
}

export interface SaveRetrieveAccountOutput {
  id: string;
  name: string;
  pattern: string;
  config: m2ConfigData | m1ConfigData;
}
