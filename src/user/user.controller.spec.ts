import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailConflictException } from './exceptions/EmailConflict.exception';
import { UserBadRequestException } from './exceptions/UserBadRequest.exception';
import { mockCreateUserDto, mockUser } from './mocks/user.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      await expect(
        userController.createUser(mockCreateUserDto),
      ).resolves.toEqual(mockUser);
    });

    it('should throw email conflict exception if user already exists', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new EmailConflictException());

      await expect(
        userController.createUser(mockCreateUserDto),
      ).rejects.toThrow(EmailConflictException);
    });

    it('should throw bad request exception on unexpected error', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new UserBadRequestException());

      await expect(
        userController.createUser(mockCreateUserDto),
      ).rejects.toThrow(UserBadRequestException);
    });
  });
});
