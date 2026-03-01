const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow"],
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
