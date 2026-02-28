const User = require("../model/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found", user: null });
    }
    res.status(201).json({ message: "ok", user: user });
  } catch (err) {
    res.status(404).json({ message: err, user: null });
  }
};

const deleteUser = async (req, res) => {
  try {
    const removedUser = await User.deleteOne({ _id: req.params.id });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user)
      return res.status(404).json({
        message: "The User with the given ID was not found.",
        user: null,
      });

    let query = { $set: {} };
    for (let key in req.body) {
      if (user[key] && user[key] !== req.body[key])
        // if the field we have in req.body exists, we're gonna update it
        query.$set[key] = req.body[key];
    }
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      query
    ).exec();

    res.status(201).json({ message: "ok", user: updatedUser });
  } catch (err) {
    res.status(404).json({ message: err, user: null });
  }
};
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
