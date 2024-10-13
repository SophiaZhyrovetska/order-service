import { User } from '../../user/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export const mockCreateUserDto: CreateUserDto = {
  email: 'user@mail.com',
  marketingData: {
    balance: 234,
  },
};

export const mockUser: User = {
  id: 1,
  email: 'user@mail.com',
  marketingData: {
    balance: 234,
  },
};
