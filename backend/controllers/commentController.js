import { Comment, User, Post } from '../models/index.js';

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

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

    const comments = await Comment.findAndCountAll({
      where: { postId, isActive: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'profileImage']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        comments: comments.rows,
        pagination: {
          total: comments.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(comments.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

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

    const comment = await Comment.create({
      text,
      postId,
      authorId: req.user.id
    });

    // Fetch the created comment with author info
    const createdComment = await Comment.findByPk(comment.id, {
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
      message: 'Comment created successfully',
      data: { comment: createdComment }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({
      where: { id: commentId, postId, isActive: true }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author or admin
    if (comment.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    await comment.update({ text });

    // Fetch updated comment with author info
    const updatedComment = await Comment.findByPk(comment.id, {
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
      message: 'Comment updated successfully',
      data: { comment: updatedComment }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findOne({
      where: { id: commentId, postId, isActive: true }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is the author or admin
    if (comment.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    // Soft delete
    await comment.update({ isActive: false });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
