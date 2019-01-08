'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING(1000),
    createdAt: DataTypes.DATE
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Comment;
};
