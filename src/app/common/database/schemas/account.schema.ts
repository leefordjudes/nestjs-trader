import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { Types } from 'mongoose';
@Schema()
export class Account {
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  login!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  server!: string;

  @Prop({ type: String, required: true })
  provisioningProfile!: string;

  @Prop({ type: Number, default: 0 })
  magic!: number;

  @Prop({ type: String, default: 'MetaApi' })
  application!: string;

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;

  constructor(data?: {
    name: string;
    login: string;
    password: string;
    server: string;
    provisioningProfile: string;
    magic: number;
    application: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (data) {
      this.name = data.name;
      this.login = data.login;
      this.password = data.password;
      this.server = data.server;
      this.provisioningProfile = data.provisioningProfile;
      this.magic = data.magic;
      this.application = data.application;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
export const AccountSchema = SchemaFactory.createForClass(Account);
