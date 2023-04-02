import mongoose from 'mongoose';
import { UserDto } from '../src/user/dto';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  },
);

userSchema.pre(
  'deleteOne',
  { document: true },
  async function (this: UserDto, next) {
    try {
      await require('./bookmark').deleteMany({ user: this._id });
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
);

export const User = mongoose.model('user', userSchema);
