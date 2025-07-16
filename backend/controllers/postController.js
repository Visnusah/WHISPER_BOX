import { Op } from 'sequelize';
import { Post, User, Comment, Vote, SavedPost } from '../models/index.js';

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = {
      isActive: true
    };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { hashtags: { [Op.contains]: [search] } }
      ];
    }

    const posts = await Post.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        },
        {
          model: Comment,
          as: 'comments',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName', 'profileImage']
            }
          ]
        }
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Add user-specific data if authenticated
    const postsWithUserData = await Promise.all(
      posts.rows.map(async (post) => {
        const postData = post.toJSON();
        
        if (req.user) {
          // Check if user has voted
          const userVote = await Vote.findOne({
            where: { postId: post.id, userId: req.user.id }
          });
          
          // Check if user has saved this post
          const isSaved = await SavedPost.findOne({
            where: { postId: post.id, userId: req.user.id }
          });

          postData.userVote = userVote ? userVote.voteType : null;
          postData.isSaved = !!isSaved;
        } else {
          postData.userVote = null;
          postData.isSaved = false;
        }

        return postData;
      })
    );

    res.json({
      success: true,
      data: {
        posts: postsWithUserData,
        pagination: {
          total: posts.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(posts.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        },
        {
          model: Comment,
          as: 'comments',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName', 'profileImage']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const postData = post.toJSON();

    // Add user-specific data if authenticated
    if (req.user) {
      const userVote = await Vote.findOne({
        where: { postId: post.id, userId: req.user.id }
      });
      
      const isSaved = await SavedPost.findOne({
        where: { postId: post.id, userId: req.user.id }
      });

      postData.userVote = userVote ? userVote.voteType : null;
      postData.isSaved = !!isSaved;
    } else {
      postData.userVote = null;
      postData.isSaved = false;
    }

    res.json({
      success: true,
      data: { post: postData }
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, hashtags = [] } = req.body;

    const post = await Post.create({
      title,
      description,
      hashtags,
      authorId: req.user.id
    });

    // Fetch the created post with author info
    const createdPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: createdPost }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;

    const post = await Post.findOne({
      where: { id, isActive: true }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or admin
    if (post.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    await post.update({
      title: title || post.title,
      description: description || post.description,
      hashtags: hashtags !== undefined ? hashtags : post.hashtags
    });

    // Fetch updated post with author info
    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, isActive: true }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author or admin
    if (post.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete
    await post.update({ isActive: false });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up', 'down', or null to remove vote

    const post = await Post.findOne({
      where: { id, isActive: true }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      where: { postId: id, userId: req.user.id }
    });

    let voteChange = 0;

    if (!voteType) {
      // Remove vote
      if (existingVote) {
        voteChange = existingVote.voteType === 'up' ? -1 : 1;
        await existingVote.destroy();
      }
    } else {
      if (existingVote) {
        // Update existing vote
        if (existingVote.voteType !== voteType) {
          voteChange = voteType === 'up' ? 2 : -2; // Change from up to down or vice versa
          await existingVote.update({ voteType });
        }
      } else {
        // Create new vote
        voteChange = voteType === 'up' ? 1 : -1;
        await Vote.create({
          postId: id,
          userId: req.user.id,
          voteType
        });
      }
    }

    // Update post vote count
    await post.update({
      votes: post.votes + voteChange
    });

    res.json({
      success: true,
      message: 'Vote updated successfully',
      data: {
        votes: post.votes + voteChange,
        userVote: voteType
      }
    });
  } catch (error) {
    console.error('Vote post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to vote on post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const posts = await Post.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        }
      ],
      order: [
        ['votes', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
