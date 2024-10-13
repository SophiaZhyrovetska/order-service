import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './services/purchase.service';
import { mockCreatePurchaseDto, mockPurchase } from './mocks/purchase.mock';

describe('PurchaseController', () => {
  let purchaseController: PurchaseController;
  let purchaseService: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    purchaseController = module.get<PurchaseController>(PurchaseController);
    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(purchaseController).toBeDefined();
  });

  describe('createPurchase', () => {
    it('should create purchase', async () => {
      jest.spyOn(purchaseService, 'create').mockResolvedValue(mockPurchase);

      await expect(
        purchaseController.createPurchase(mockCreatePurchaseDto),
      ).resolves.toEqual(mockPurchase);
    });
  });
});
