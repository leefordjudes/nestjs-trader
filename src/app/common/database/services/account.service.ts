import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Types } from 'mongoose';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { DatabaseService } from '../database.service';
import { Account } from '../schemas';

@Injectable()
export class AccountService {
  constructor(private db: DatabaseService) {}
  async create(data: SaveAccountInput) {
    const config = new ConfigService();
    const provisioningProfile = config.get('PROVISIONING_PROFILE');
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
    const account = await this.findById(id);
    account.name = data.name;
    account.login = data.login;
    account.password = data.password;
    account.server = data.server;
    account.updatedAt = new Date();
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
}

export class SaveAccountInput {
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsNotEmpty()
  login!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  server!: string;
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
}
