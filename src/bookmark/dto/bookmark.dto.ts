import { Types } from 'mongoose';

export class BookmarkDto {
  _id?: Types.ObjectId;
  title: string;
  user: Types.ObjectId;
  link: string;
  description: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
