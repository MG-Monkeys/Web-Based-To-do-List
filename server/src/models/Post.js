import mongoose from 'mongoose';
import Tag from './Tag.js';
import Time from './Time.js';

const postSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String, 
    required: true,
  },
  tags: {
    type: [String],
    required: true,
},
time: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Time',
    required: true,
},
  reoccurance: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  creatorId: {
    type: Number,
    required: true,
  },
  groupId: {
    type: Number,
    required: true,
  },

});

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
