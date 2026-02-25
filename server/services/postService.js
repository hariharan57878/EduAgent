import Post from '../models/Post.js';

export const getPosts = async (channel) => {
  const filter = channel ? { channel } : {};
  return await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(50);
};

export const createPost = async (userId, username, postData) => {
  const { channel, content } = postData;
  const newPost = new Post({
    userId,
    username,
    channel,
    content
  });
  return await newPost.save();
};
