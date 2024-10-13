import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { Purchase } from '../entities/purchase.entity';
import { mockOffer } from './offer.mock';
import { mockUser } from './user.mock';

export const mockCreatePurchaseDto: CreatePurchaseDto = {
  userId: 1,
  offerId: 1,
};

export const mockPurchase: Purchase = {
  id: 1,
  user: mockUser,
  offer: mockOffer,
};
