import { SavedPost, Post, User } from '../models/index.js';

export const getSavedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const savedPosts = await SavedPost.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Post,
          as: 'post',
          where: { isActive: true },
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName', 'profileImage']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const posts = savedPosts.rows.map(savedPost => ({
      ...savedPost.post.toJSON(),
      isSaved: true,
      userVote: null // You might want to fetch this separately
    }));

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          total: savedPosts.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(savedPosts.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findOne({
      where: { id: postId, isActive: true }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already saved
    const existingSave = await SavedPost.findOne({
      where: { postId, userId: req.user.id }
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Post already saved'
      });
    }

    await SavedPost.create({
      postId,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Post saved successfully'
    });
  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const savedPost = await SavedPost.findOne({
      where: { postId, userId: req.user.id }
    });

    if (!savedPost) {
      return res.status(404).json({
        success: false,
        message: 'Saved post not found'
      });
    }

    await savedPost.destroy();

    res.json({
      success: true,
      message: 'Post unsaved successfully'
    });
  } catch (error) {
    console.error('Unsave post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsave post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
