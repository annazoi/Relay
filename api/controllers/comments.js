const Post = require("../model/Post");
const Notification = require("../model/Notification");

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      description: req.body.description,
      creatorId: req.userId,
    });

    await post.save();

    if (String(post.creatorId) !== req.userId) {
      await Notification.create({
        recipient: post.creatorId,
        sender: req.userId,
        type: "comment",
        post: post._id,
      });
    }

    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id }).then(function (post) {
      post.comments.pull({ _id: req.params.commentId });
      post.save();
    });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.json({ message: "Could not remove comment" });
  }
};

exports.createComment = createComment;
exports.deleteComment = deleteComment;
