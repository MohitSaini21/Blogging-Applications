const { Router } = require("express");
const path = require("path");
const { Blog } = require("../models/blog");
const { Comment } = require("../models/comment");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const FileName = `${Date.now()}-${file.originalname}`;
    cb(null, FileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();
router.get("/addnew", (req, res) => {
  res.render("AddBlog", {
    User: req.user,
  });
});
router.post("/addnew", upload.single("CoverImage"), async (req, res) => {
  try {
    const NewBlog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      CreatedBy: req.user._id,
      CoverImageUrl: `uploads/${req.file.filename}`,
    });
    // console.log(NewBlog);
    return res.redirect(`/blog/${NewBlog._id}`);
  } catch (err) {
    console.log("There is an error in saving the blog", err);
  }
});
router.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("CreatedBy");

  const AllComments = await Comment.find({ BlogId: req.params.id }).populate(
    "PassedBy"
  );
//   console.log(AllComments);
  //   console.log(blog);
  return res.render("vlog.ejs", {
    blog: blog,
    User: req.user,
    AllComments: AllComments,
  });
});

router.post("/comment/:id", async (req, res) => {
//   console.log("in");
  try {
    const NewComment = await Comment.create({
      comment: req.body.comment,
      BlogId: req.params.id,
      PassedBy: req.user._id,
    });
    // console.log(NewComment);
    return res.redirect(`/blog/${req.params.id}`);
  } catch (err) {
    console.log("gettting", err);
  }
});
module.exports = {
  router,
};
