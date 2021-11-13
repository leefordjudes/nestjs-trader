import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import * as schemas from './schemas';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('Account')
    public readonly accountModel: Model<schemas.Account & Document>,
    @InjectModel('User')
    public readonly userModel: Model<schemas.User & Document>,
  ) {}

  async startSession() {
    return await this.accountModel.db.startSession();
  }
}
