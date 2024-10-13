import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { Purchase } from '../entities/purchase.entity';
import { User } from '../../user/entities/user.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { ReportService } from './report.service';
import { AnalyticsService } from './analytics.service';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception';
import { OfferNotFoundException } from '../exceptions/OfferNotFound.exception';
import { mockOffer } from '../mocks/offer.mock';
import { mockCreatePurchaseDto, mockPurchase } from '../mocks/purchase.mock';
import { mockUser } from '../mocks/user.mock';

describe('PurchaseService', () => {
  let purchaseService: PurchaseService;
  let purchaseRepository: Repository<Purchase>;
  let offerRepository: Repository<Offer>;
  let userRepository: Repository<User>;
  let analyticsService: AnalyticsService;
  let reportService: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Offer),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            sendEventToAnalytics: jest.fn(),
          },
        },
        {
          provide: ReportService,
          useValue: {
            scheduleReport: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
    purchaseRepository = module.get<Repository<Purchase>>(
      getRepositoryToken(Purchase),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    offerRepository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    reportService = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(purchaseService).toBeDefined();
  });

  describe('createPurchase', () => {
    it('should throw exception if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        purchaseService.create(mockCreatePurchaseDto),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('should throw exception if offer is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(null);

      await expect(
        purchaseService.create(mockCreatePurchaseDto),
      ).rejects.toThrow(OfferNotFoundException);
    });

    it('should create purchase, send request to analytics and send report', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(mockOffer);
      jest.spyOn(purchaseRepository, 'create').mockReturnValue(mockPurchase);
      jest.spyOn(purchaseRepository, 'save').mockResolvedValue(mockPurchase);

      const result = await purchaseService.create(mockCreatePurchaseDto);

      expect(analyticsService.sendEventToAnalytics).toHaveBeenCalledWith({
        purchaseId: mockPurchase.id,
        userId: mockUser.id,
        offerId: mockOffer.id,
      });

      expect(reportService.scheduleReport).toHaveBeenCalledWith(
        mockUser.id,
        mockPurchase.id,
      );

      expect(result).toEqual(mockPurchase);
    });
  });
});
