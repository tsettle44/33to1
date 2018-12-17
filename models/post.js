var mongooose = require('mongoose');

var PostSchema = new mongooose.Schema({
    postedBy: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true
      },
      createdAt: {
          type: Date,
          required: true,
          default: Date.now()
      },
      likes: {
          type: Number,
          required: true,
          default: 0
      }
});

var Post = mongooose.model('Post' , PostSchema);
module.exports = Post;