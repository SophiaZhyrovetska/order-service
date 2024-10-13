import { Logger, Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './services/purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Offer } from '../offer/entities/offer.entity';
import { User } from '../user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportService } from './services/report.service';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User, Offer]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, ReportService, AnalyticsService, Logger],
})
export class PurchaseModule {}
