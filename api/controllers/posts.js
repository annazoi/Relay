const Post = require("../model/Post");
const Notification = require("../model/Notification");
const cloudinary = require("../utils/cloudinary");

const createPost = async (req, res) => {
  const { description, image } = req.body;
  try {
    let imageUrl = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "posts",
      });
      imageUrl = result.url;
    }

    const post = await Post.create({
      description,
      image: imageUrl,
      creatorId: req.userId,
    });

    res.status(201).json({
      message: "OK",
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Could not create post. Please try later",
      post: null,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({
      _id: req.params.id,
      creatorId: req.userId,
    });
    res.json(removedPost);
  } catch (err) {
    res.status(404).send({ message: "post not found" });
  }
};

const getPosts = async (req, res) => {
  try {
    let filter = {};
    const creatorId = req.query.creatorId;
    if (creatorId) {
      filter = { creatorId: creatorId };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creatorId comments.creatorId", "-password");

    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "No more posts", posts: [] });
    }
    res.status(200).json({ message: "ok", posts: posts });
  } catch (err) {
    res.status(500).json({ message: "Server error", posts: null });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "creatorId comments.creatorId",
      "-password"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not Found", post: null });
    }

    res.status(201).json({ message: "ok", post: post });
  } catch (err) {
    return res.status(404).json({ message: "Post not Found", post: null });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.userId)) {
      await post.updateOne({ $push: { likes: req.userId } });

      if (String(post.creatorId) !== req.userId) {
        await Notification.create({
          recipient: post.creatorId,
          sender: req.userId,
          type: "like",
          post: post._id,
        });
      }

      res.status(200).json({ message: "Post liked" });
    } else {
      res.status(400).json({ message: "Post already liked" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.userId)) {
      await post.updateOne({ $pull: { likes: req.userId } });
      res.status(200).json({ message: "Post unliked" });
    } else {
      res.status(400).json({ message: "Post not liked yet" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPost = createPost;
exports.deletePost = deletePost;
exports.getPosts = getPosts;
exports.getPost = getPost;
exports.likePost = likePost;
exports.unlikePost = unlikePost;
