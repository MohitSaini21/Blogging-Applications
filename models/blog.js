const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    CoverImageUrl: {
      type: String,
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const  Blog = model("Blog", BlogSchema);
module.exports={
    Blog
}
