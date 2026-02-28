const Post = require("../model/Post");

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      description: req.body.description,
      creatorId: req.userId,
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.json({ message: error });
  }
};

// const getComments = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     post.comments.push({
//       description: res.json(description),
//     });

//     await post.save();
//     res.json(post);
//   } catch (err) {
//     res.json({ message: err });
//   }
// };

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id }).then(function (
      post
    ) {
      post.comments.pull({ _id: req.params.commentId });
      post.save();
      console.log(req.params.id);
    });
    await post.save();
    res.json(post);

    // const post = await Post.update(
    //   { _id: req.params.id },
    //   {
    //     $pullAll: {
    //       comments: { _id: req.params.commentId },
    //     },
    //   }
    // );

    // console.log(req.params.commentId);
    // post.comments.pull({
    //   _id: req.params.commentId,
    // });

    // await post.save();
    // res.json(post);
  } catch (error) {
    res.json({ message: "do not remove comment" });
  }
};

// const getComments = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     post.comments.push();
//     res.json(post);
//   } catch (err) {
//     res.json({ message: err });
//   }
// };

// const getComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     res.json(comment);
//   } catch (err) {
//     res.json({ message: err });
//   }
// };

// const updateComment = async (req, res) => {};

exports.createComment = createComment;
exports.deleteComment = deleteComment;
// exports.getComments = getComments;
// exports.getComment = getComment;
