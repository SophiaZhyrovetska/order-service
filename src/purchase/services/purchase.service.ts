import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { User } from '../../user/entities/user.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { OfferNotFoundException } from '../exceptions/OfferNotFound.exception';
import { PurchaseBadRequestException } from '../exceptions/PurchaseBadRequest.exception';
import { PurchaseEvent } from '../interfaces/purchaseEvent.interface';
import { ReportService } from './report.service';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,

    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
    private readonly reportService: ReportService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const { offerId, userId } = createPurchaseDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UserNotFoundException();
    }

    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
    });

    if (!offer) {
      throw new OfferNotFoundException();
    }

    try {
      const purchase = this.purchaseRepository.create({ user, offer });

      await this.purchaseRepository.save(purchase);

      this.logger.log(
        `Created purchase with id ${purchase.id} for user with id ${userId}`,
      );

      const purchaseEvent: PurchaseEvent = {
        purchaseId: purchase.id,
        userId,
        offerId,
      };

      await this.analyticsService.sendEventToAnalytics(purchaseEvent);

      this.reportService.scheduleReport(userId, purchase.id);

      return purchase;
    } catch (error) {
      this.logger.error(error);
      throw new PurchaseBadRequestException();
    }
  }
}
