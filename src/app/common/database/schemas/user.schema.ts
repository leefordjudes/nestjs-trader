import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  accessId!: string;

  @Prop({ type: String, required: true })
  accessKey!: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
