import User from './User.js';
import Post from './Post.js';
import Comment from './Comment.js';
import Vote from './Vote.js';
import SavedPost from './SavedPost.js';

// User-Post associations
User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts'
});
Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// User-Comment associations
User.hasMany(Comment, {
  foreignKey: 'authorId',
  as: 'comments'
});
Comment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// Post-Comment associations
Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments'
});
Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

// User-Vote associations
User.hasMany(Vote, {
  foreignKey: 'userId',
  as: 'votes'
});
Vote.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Post-Vote associations
Post.hasMany(Vote, {
  foreignKey: 'postId',
  as: 'postVotes'
});
Vote.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

// User-SavedPost associations
User.hasMany(SavedPost, {
  foreignKey: 'userId',
  as: 'savedPosts'
});
SavedPost.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Post-SavedPost associations
Post.hasMany(SavedPost, {
  foreignKey: 'postId',
  as: 'saves'
});
SavedPost.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

export {
  User,
  Post,
  Comment,
  Vote,
  SavedPost
};
