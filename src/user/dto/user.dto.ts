import { Types } from 'mongoose';

export class UserDto {
  _id: Types.ObjectId;
  email: string;
  first_name: string;
  last_name: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
