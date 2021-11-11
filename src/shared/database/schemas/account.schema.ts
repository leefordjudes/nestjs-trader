import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema()
export class Account {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name!: string;
}
export const AccountSchema = SchemaFactory.createForClass(Account);
