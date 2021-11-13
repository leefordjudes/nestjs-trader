import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Types } from 'mongoose';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { DatabaseService } from '../database.service';
import { Account } from '../schemas';
import { configurations } from '../../../shared/fixtures/config/config';
import { METHODS } from 'src/app/shared/fixtures/method';

@Injectable()
export class AccountService {
  constructor(private db: DatabaseService, private config: ConfigService) {}
  async create(data: SaveAccountInput) {
    const provisioningProfile = this.config.get('PROVISIONING_PROFILE');
    const account = new Account({
      name: data.name,
      login: data.login,
      password: data.password,
      server: data.server,
      provisioningProfile,
      magic: 0,
      application: 'MetaApi',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedAccount = await this.db.accountModel.create(account);
    const result: SaveRetrieveAccountOutput = {
      id: savedAccount._id.toString(),
      name: savedAccount.name,
      login: savedAccount.login,
      password: savedAccount.password,
      server: savedAccount.server,
      provisioningProfile: savedAccount.provisioningProfile,
      magic: savedAccount.magic,
      application: savedAccount.application,
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
    const provisioningProfile = this.config.get('PROVISIONING_PROFILE');
    const account = await this.findById(id);
    account.name = data.name;
    account.login = data.login;
    account.password = data.password;
    account.server = data.server;
    account.updatedAt = new Date();
    account.provisioningProfile = provisioningProfile;
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
      login: updatedAccount.login,
      password: updatedAccount.password,
      server: updatedAccount.server,
      provisioningProfile: updatedAccount.provisioningProfile,
      magic: updatedAccount.magic,
      application: updatedAccount.application,
    };
    return result;
  }

  async retrieve(id: Types.ObjectId) {
    const account = await this.findById(id);
    const result: SaveRetrieveAccountOutput = {
      id: account._id.toString(),
      name: account.name,
      login: account.login,
      password: account.password,
      server: account.server,
      provisioningProfile: account.provisioningProfile,
      magic: account.magic,
      application: account.application,
      pattern: account.pattern,
      confif: JSON.parse(account.config),
    };
    return result;
  }

  async list() {
    const accounts = await this.db.accountModel.find({});
    return accounts.map((elm) => {
      return {
        id: elm._id.toString(),
        name: elm.name,
        login: elm.login,
        server: elm.server,
        password: elm.password,
      };
    });
  }

  async retriveConfig(method?: string) {
    if (method && ['M1', 'M2'].includes(method)) {
      return configurations.find((m) => m.code === method);
    }
    return configurations;
  }

  async patternList() {
    return METHODS;
  }

  async applyPattern(id: Types.ObjectId, data: SaveAccountPatternInput) {
    const account = await this.findById(id);
    account.pattern = data.pattern;
    account.config = JSON.stringify(data.config);
    const updatedAccount = await this.db.accountModel.findOneAndUpdate(
      { _id: id },
      account,
      {
        new: true,
        overwrite: true,
        runValidators: true,
      },
    );
    const result: SaveRetrieveAccountOutput = {
      id: updatedAccount.id,
      name: updatedAccount.name,
      login: updatedAccount.login,
      password: updatedAccount.password,
      server: updatedAccount.server,
      provisioningProfile: updatedAccount.provisioningProfile,
      magic: updatedAccount.magic,
      application: updatedAccount.application,
      pattern: updatedAccount.pattern,
      confif: JSON.parse(updatedAccount.config),
    };
    return result;
  }
}

export enum AccountPattern {
  M1 = 'M1',
  M2 = 'M2',
}

export class SaveAccountInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @IsString()
  login!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  server!: string;
}

class m1ConfigData {
  @IsNotEmpty()
  @IsNumber()
  jump!: number;

  @IsNotEmpty()
  @IsNumber()
  initial!: number;

  @IsNotEmpty()
  @IsNumber()
  threshold!: number;

  @IsNotEmpty()
  @IsNumber()
  limit!: number;

  @IsNotEmpty()
  @IsNumber()
  resistance!: number;

  @IsNotEmpty()
  @IsNumber()
  support!: number;
}

class m2ConfigData {
  @IsNotEmpty()
  @IsNumber()
  jump!: number;

  @IsNotEmpty()
  @IsNumber()
  initial!: number;

  @IsNotEmpty()
  @IsNumber()
  threshold!: number;

  @IsNotEmpty()
  @IsNumber()
  limit!: number;

  @IsNotEmpty()
  @IsNumber()
  resistance!: number;

  @IsNotEmpty()
  @IsNumber()
  support!: number;
}
export class SaveAccountPatternInput {
  @IsNotEmpty()
  @IsEnum(AccountPattern)
  pattern!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type((val) => (val.object['pattern'] === 'M1' ? m1ConfigData : m2ConfigData))
  config!: m1ConfigData | m2ConfigData;
}

export interface SaveRetrieveAccountOutput {
  id: string;
  name: string;
  login: string;
  password: string;
  server: string;
  provisioningProfile: string;
  application: string;
  magic: number;
  pattern?: string;
  confif?: m1ConfigData | m2ConfigData;
}
