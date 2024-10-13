import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PurchaseEvent } from '../interfaces/purchaseEvent.interface';

@Injectable()
export class AnalyticsService {
  private readonly analyticsServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.analyticsServiceUrl = this.configService.get<string>(
      'ANALYTICS_SERVICE_URL',
    );
  }

  async sendEventToAnalytics(event: PurchaseEvent) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.analyticsServiceUrl, event),
      );

      this.logger.log('Event sent to analytics', data);
    } catch (error) {
      this.logger.error(`Failed to send event to analytics`, error);
    }
  }
}
