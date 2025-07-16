import { Vote, Post, User } from '../models/index.js';
import { Op } from 'sequelize';

// Vote on a post (like/dislike)
export const votePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'up' or 'down'
    const userId = req.user.id;

    // Validate vote type
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be "up" or "down"'
      });
    }

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post is active
    if (!post.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on inactive post'
      });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      where: { postId, userId }
    });

    let voteChange = 0;

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await existingVote.destroy();
        voteChange = voteType === 'up' ? -1 : 1;
        
        return res.json({
          success: true,
          message: 'Vote removed successfully',
          data: {
            action: 'removed',
            voteType: null,
            voteChange
          }
        });
      } else {
        // Update existing vote
        await existingVote.update({ voteType });
        voteChange = voteType === 'up' ? 2 : -2; // Change from down to up (+2) or up to down (-2)
        
        // Update post votes count
        await post.update({
          votes: post.votes + voteChange
        });

        return res.json({
          success: true,
          message: 'Vote updated successfully',
          data: {
            action: 'updated',
            voteType,
            voteChange
          }
        });
      }
    } else {
      // Create new vote
      await Vote.create({ postId, userId, voteType });
      voteChange = voteType === 'up' ? 1 : -1;
    }

    // Update post votes count
    await post.update({
      votes: post.votes + voteChange
    });

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        action: 'created',
        voteType,
        voteChange
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

// Remove vote from a post
export const removeVote = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      where: { postId, userId }
    });

    if (!existingVote) {
      return res.status(404).json({
        success: false,
        message: 'No vote found to remove'
      });
    }

    // Calculate vote change
    const voteChange = existingVote.voteType === 'up' ? -1 : 1;

    // Remove vote
    await existingVote.destroy();

    // Update post votes count
    await post.update({
      votes: post.votes + voteChange
    });

    res.json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        action: 'removed',
        voteChange
      }
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get post votes information
export const getPostVotes = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Get vote counts
    const upVotes = await Vote.count({
      where: { postId, voteType: 'up' }
    });

    const downVotes = await Vote.count({
      where: { postId, voteType: 'down' }
    });

    let userVote = null;
    if (req.user) {
      const vote = await Vote.findOne({
        where: { postId, userId: req.user.id }
      });
      userVote = vote ? vote.voteType : null;
    }

    res.json({
      success: true,
      data: {
        postId,
        totalVotes: post.votes,
        upVotes,
        downVotes,
        userVote
      }
    });
  } catch (error) {
    console.error('Get post votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get post votes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
