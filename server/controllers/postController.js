import * as postService from '../services/postService.js';

export const getRecentPosts = async (req, res) => {
  try {
    const { channel } = req.query;
    const posts = await postService.getPosts(channel);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const addNewPost = async (req, res) => {
  try {
    const username = req.user.username || 'Anonymous';
    const post = await postService.createPost(req.user.id, username, req.body);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
