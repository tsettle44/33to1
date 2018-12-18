var mongooose = require('mongoose');

var CommentToCommentSchema = new mongooose.Schema({
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
  })

var CommentSchema = new mongooose.Schema({
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
    },
    comments: [CommentToCommentSchema]
});

CommentSchema.method("like", function(vote, callback){
  this.likes += 1;
  this.parent().save(callback);
});

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
      },
      comments: [CommentSchema] 
});

PostSchema.method("like", function(vote, callback){
  this.likes += 1;
  this.save(callback);
});

var Post = mongooose.model('Post', PostSchema);
module.exports.Post = Post;