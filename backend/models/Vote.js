import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vote = sequelize.define('Vote', {
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
  },
  voteType: {
    type: DataTypes.ENUM('up', 'down'),
    allowNull: false
  }
}, {
  tableName: 'votes',
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'user_id']
    },
    {
      fields: ['post_id']
    },
    {
      fields: ['user_id']
    }
  ]
});

export default Vote;
