import { Types } from 'mongoose';

export class BookmarkFilterDto {
  _id?: Types.ObjectId | string;
  user?: Types.ObjectId | string;
  title?: string;
  link?: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
  search?: string;
  count?: number;
  page?: number;
  userId?: string;
}
