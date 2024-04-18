import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateUserArgs } from './dto/create-user.args';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
  }

  async create(args: CreateUserArgs): Promise<User> {
    const newUser = this.userModel.create(args);
    return newUser;
  }
}
