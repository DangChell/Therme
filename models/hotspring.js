const mongoose = require('mongoose');
const Comment = require('./comment');

//Schema Setup
const hotspringSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

//remove comments along with hotspring when deleted from db
hotspringSchema.pre('remove', async function() {
  await Comment.remove({
    _id: {
      $in: this.comments,
    },
  });
});

module.exports = mongoose.model('Hotspring', hotspringSchema);
