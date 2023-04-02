import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bookmark, User } from '../../models';
import mongoose from 'mongoose';

let conn = async (config: ConfigService) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(config.get('DB_URI'), {
        dbName: config.get('DB_NAME'),
      })
      .then(async () => {
        return resolve('MongoDB Connected!');
      })
      .catch((error) => reject(JSON.stringify(error)));
  });
};

@Injectable()
export class DbService {
  constructor(config: ConfigService) {
    (async () => {
      try {
        let con = await conn(config);
        if (con !== 'MongoDB Connected!') throw con;
      } catch (error) {
        console.log(error);
      }
    })();
  }

  cleanDb = async function () {
    await Bookmark.deleteMany();
    await User.deleteMany();
  };
}
