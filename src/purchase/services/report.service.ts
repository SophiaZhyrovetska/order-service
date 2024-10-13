import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReportService {
  private readonly reportServiceUrl: string;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.reportServiceUrl =
      this.configService.get<string>('REPORT_SERVICE_URL');
  }

  scheduleReport(userId: number, purchaseId: number) {
    const timeout = setTimeout(
      () => {
        this.sendReport(userId, purchaseId);
      },
      1000 * 60 * 60 * 24,
    );

    this.schedulerRegistry.addTimeout(`report-${purchaseId}`, timeout);
  }

  private async sendReport(userId: number, purchaseId: number) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(this.reportServiceUrl, { userId }),
      );

      this.logger.log(
        `Report sent to user with id ${userId} for purchase with id ${purchaseId}`,
        data,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send report to user with id ${userId} for purchase with id ${purchaseId}`,
        error,
      );
    }
  }
}
