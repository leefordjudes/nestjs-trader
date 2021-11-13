import { Injectable, Scope } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class AuthContext {
  user: {
    id: Types.ObjectId;
    accessId: string;
    accessKey: string;
  };
}
