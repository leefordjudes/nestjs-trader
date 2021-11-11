import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import * as schemas from './schemas';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel('Account')
    public readonly accountModel: Model<schemas.Account & Document>,
  ) {}

  async startSession() {
    return await this.accountModel.db.startSession();
  }
}
