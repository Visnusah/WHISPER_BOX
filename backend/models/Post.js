import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000]
    }
  },
  hashtags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    validate: {
      isValidHashtags(value) {
        if (value && value.length > 10) {
          throw new Error('Maximum 10 hashtags allowed');
        }
        if (value && value.some(tag => tag.length > 50)) {
          throw new Error('Hashtag too long (max 50 characters)');
        }
      }
    }
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'posts',
  indexes: [
    {
      fields: ['author_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['votes']
    }
  ]
});

export default Post;
