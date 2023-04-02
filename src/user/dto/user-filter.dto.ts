import { Types } from 'mongoose';

export class UserFilterDto {
  _id?: Types.ObjectId | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}
