import { Injectable } from '@nestjs/common';
import { BookmarkDto, UpdateBookmarkDto } from './dto';
import { Bookmark } from '../../models';
import mongoose from 'mongoose';
import { CreateBookmarkDto } from './dto/create.dto';

@Injectable()
export class BookmarkService {
  createBookmark = async function (userId: string, body: CreateBookmarkDto) {
    try {
      let created = await new Bookmark({
        user: userId,
        ...body,
      }).save();

      if (!created) throw Error('Could not create bookmark');

      return {
        code: 201,
        status: 'success',
        msg: 'Created bookmark successfully',
        data: created,
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  };

  getListBookmark = async ({
    userId,
    search = null,
    count = null,
    page = null,
  }) => {
    let currentPage = page ? page : 1;
    let limit = count ? count : 10;
    let offset = (currentPage - 1) * limit;
    let filter = {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    };
    if (search) {
      filter.$match['$or'] = [
        {
          title: {
            $regex: search,
            $options: 'gi',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'gi',
          },
        },
      ];
    }
    let aggregate = [
      filter,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          results: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          results: { $slice: ['$results', offset, limit] },
        },
      },
    ];
    try {
      let bookmarks = await Bookmark.aggregate(aggregate);
      if (!bookmarks.length) {
        return {
          results: [],
        };
      }
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully retrieved data',
        data: bookmarks[0],
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      return { code: 400, status: 'failed', msg: error.message };
    }
  };

  async getBookmark(userId: string, bookmarkId: string) {
    try {
      let found = await Bookmark.findOne({ user: userId, _id: bookmarkId });
      if (!found) throw Error('Bookmark not found');
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully retrieved data',
        data: found,
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  }

  async updateBookmark(
    userId: string,
    bookmarkId: string,
    bookmark: UpdateBookmarkDto,
  ) {
    try {
      let found = await Bookmark.findOne({ user: userId, _id: bookmarkId });
      if (!found) throw Error('Bookmark not found');

      let updated = await Bookmark.findOneAndUpdate(
        {
          _id: found._id,
        },
        {
          ...bookmark,
        },
      );
      if (!updated) throw Error('Could not update bookmark');
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully updated bookmark',
        data: updated,
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    try {
      let deleted = await Bookmark.deleteOne({ user: userId, _id: bookmarkId });
      if (!deleted) throw Error('Could not delete bookmark');
      return {
        code: 200,
        status: 'success',
        msg: 'Successfully deleted bookmark',
      };
    } catch (error) {
      return { code: 400, status: 'failed', msg: error.message };
    }
  }
}
