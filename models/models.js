//USER
/*
  UserSchema = {
    name: String,
    email: String,
    password: String,
    createdAt: {type: Date, default: Date.Now},
    points: Number,
    posts: {
      POSTS
    }
  }
*/

//POST
/*
  PostSchema = {
      postedBy: String,
      name: {type: String, default: postedBy},
      body: String, 
      createdAt: {type: Date, default: Date.Now},
      likes: {type: Number, default: 0},
      comments: {CommentSchema}
  }
*/

//COMMENT
/*
  CommentSchema = {
      postedBy: String,
      name: {type: String, default: postedBy},
      body: String, 
      createdAt: {type: Date, default: Date.Now},
      votes: {type: Number, default: 0},
      comments: {CommentSchema}
  }
*/