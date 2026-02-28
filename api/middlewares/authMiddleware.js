const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).send({ message: "You are not authorized" });
    }
  }

  if (!token) {
    return res.status(401).send({ message: "You are not authorized" });
  }
};

module.exports = { protect };
