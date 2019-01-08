'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: DataTypes.INTEGER,
    firstName: DataTypes.STRING(50),
    lastName: DataTypes.STRING(50),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(140),
    dob: DataTypes.DATEONLY,
    profilePictureUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'postId',
      as: 'posts'
    });
    User.hasMany(models.Like, {
      foreignKey: 'likeId',
      as: 'likes'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'commentId',
      as: 'comments'
    });
  };
  return User;
};
