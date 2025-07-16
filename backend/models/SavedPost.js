import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedPost = sequelize.define('SavedPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'saved_posts',
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'user_id']
    },
    {
      fields: ['user_id']
    }
  ]
});

export default SavedPost;
