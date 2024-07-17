const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    PassedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    BlogId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    }

  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);
module.exports = {
  Comment,
};
