import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 200,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'bookmark',
  },
);

export const Bookmark = mongoose.model('bookmark', bookmarkSchema);
