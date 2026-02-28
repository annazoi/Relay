const Post = require("../model/Post");

const createPost = async (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);
  try {
    const post = await Post.create({
      title,
      description,
      creatorId: req.userId,
    });

    res.status(201).json({
      message: "OK",
      post: post,
    });
  } catch (error) {
    res.json({
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
    const posts = await Post.find(filter).populate(
      "creatorId comments.creatorId",
      "-password"
    );

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "Not found Posts yet", posts: null });
    }
    res.status(201).json({ message: "ok", posts: posts });
  } catch (err) {
    res.status(404).json({ message: "Not found posts yet", posts: null });
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
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.getPosts = getPosts;
exports.getPost = getPost;
