const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res, next) => {
  const { name, surname, username, email, password, confirmPassword, image } =
    req.body;
  console.log(req.body);

  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [
        {
          email: email,
        },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Signing up failed, please try again later. 1" });
  }

  if (existingUser) {
    return res.status(400).send({ message: "User already exits" });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({ message: "Passwords do not match" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);

    return res.status(400).send({ message: "Could not create user" });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "users",
    });
    console.log(result.url);
    const createdUser = await User.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      image: result.url,
    });

    let token;

    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(201).json({ userId: createdUser.id, token: token });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Could not create user" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [
        {
          email: email,
        },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later." });
  }

  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  if (!isValidPassword) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later.2" });
  }

  res.status(200).json({
    userId: existingUser.id,
    token: token,
  });
};

exports.register = register;
exports.login = login;
