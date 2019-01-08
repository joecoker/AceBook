'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING(1000),
    createdAt: DataTypes.DATE
  }, {});
  Post.associate = function(models) {
    Post.hasMany(models.Like, {
      foreignKey: 'likeId',
      as: 'likes'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'commentId',
      as: 'comments'
    });
    Post.belongsTo(models.User, {
      foreignKey: 'postId'
    });
  };
  return Post;
};
