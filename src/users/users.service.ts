import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async findOne(userName: string): Promise<User> {
    const [user, isCreated] = await this.userModel.findOrCreate({
      where: {
        userName,
      },
    });
    return user;
  }
}
