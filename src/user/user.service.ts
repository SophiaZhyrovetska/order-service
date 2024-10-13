import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailConflictException } from './exceptions/EmailConflict.exception';
import { UserBadRequestException } from './exceptions/UserBadRequest.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new EmailConflictException();
    }

    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      this.logger.log(`Created user with id ${user.id}`);

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new UserBadRequestException();
    }
  }
}
