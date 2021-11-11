import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import * as schemas from './schemas';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const dbUri = config.get('DB_URI');
        return {
          uri: dbUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Account', schema: schemas.AccountSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
