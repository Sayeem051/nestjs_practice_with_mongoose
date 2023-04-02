import { Injectable } from '@nestjs/common';
import { User } from '../../models';
import { Types } from 'mongoose';
import { UpdateUserDto, UserFilterDto } from './dto';

@Injectable()
export class UserService {
  getUser = async (filter: UserFilterDto) => {
    try {
      let found = await User.findOne(filter);
      return found;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  };
  updateUser = async (
    userId: string,
    body: UpdateUserDto,
  ): Promise<{ code: number; status: string; msg: string }> => {
    try {
      if (Object.keys(body).includes('email')) {
        let user = await this.getUser({ _id: userId });
        if (user && user._id.toString() !== userId.toString()) {
          throw Error('User with this email already exists');
        }
      }
      let updated = await User.findByIdAndUpdate(userId, body);
      if (!updated) throw Error('Failed to update user');
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully updated user!',
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  };
}
