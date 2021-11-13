import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './app/common/database/database.module';
import { AccountingModule } from './app/accounting/accounting.module';
import { AuthModule } from './app/auth/auth.module';
import { GlobalModule } from './app/common/global/global.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './config/.env', isGlobal: true }),
    GlobalModule,
    DatabaseModule,
    AccountingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
