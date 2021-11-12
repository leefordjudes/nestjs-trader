import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { Types } from 'mongoose';
import * as _ from 'lodash';

import { AccountPattern } from '../services';

@Schema({ _id: false })
export class M1Config {
  @Prop({ type: Number, required: true })
  jump!: number;

  @Prop({ type: Number, required: true })
  limit!: number;

  @Prop({ type: Number, required: true })
  init!: number;

  @Prop({ type: Number, required: true })
  threshold!: number;

  @Prop({ type: Number, required: true })
  five!: number;

  @Prop({ type: Number, required: true })
  m1!: number;

  constructor(data?: {
    jump?: number;
    limit?: number;
    init: number;
    threshold: number;
    five: number;
    m1: number;
  }) {
    if (data) {
      _.assign(this, data);
    }
  }
}
const M1ConfigSchema = SchemaFactory.createForClass(M1Config);

@Schema({ _id: false })
export class M2Config {
  @Prop({ type: Number, required: true })
  jump!: number;

  @Prop({ type: Number, required: true })
  limit!: number;

  @Prop({ type: Number, required: true })
  init!: number;

  @Prop({ type: Number, required: true })
  threshold!: number;

  @Prop({ type: Number, required: true })
  five!: number;

  @Prop({ type: Number, required: true })
  m2!: number;

  constructor(data?: {
    jump?: number;
    limit?: number;
    init: number;
    threshold: number;
    five: number;
    m2: number;
  }) {
    if (data) {
      _.assign(this, data);
    }
  }
}
const M2ConfigSchema = SchemaFactory.createForClass(M2Config);

@Schema()
export class Account {
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  validateName!: string;

  @Prop({ type: String, enum: AccountPattern, required: true })
  pattern!: string;

  @Prop({ type: M1ConfigSchema || M2ConfigSchema, required: true })
  config!: M1Config | M2Config;

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;

  constructor(data?: {
    name: string;
    validateName: string;
    pattern: string;
    config: M1Config | M2Config;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (data) {
      this.name = data.name;
      this.pattern = data.pattern;
      this.validateName = data.validateName;
      this.config = data.config;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
export const AccountSchema = SchemaFactory.createForClass(Account);
