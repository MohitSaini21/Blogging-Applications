require("dotenv").config();
// console.log(path.resolve("./EjsFile"))
// console.log(path.join(__dirname,'EjsFile')) Both works similar you could use anyone of them.
// Introducing the new feature of the ejs engine i.e is you could even segrigate the common features which are going to be same for every page
// role:{
//     type:String,
//     enum:["User","Admin"]
// } this means you could not fill any value except these two options

// There is built in module crypto is used to hash the passwords
// return { ...user, password: undefined, email: undefined }; ... thsi is the separate operator and this is used to copy the object and you could overwrite the existing property usign the same key name

//   res
//   .cookie("jwt","logout", {
//     httpOnly: true,
//     maxAge: 1,
//   })
//   .redirect("/");
// })
// res.clearCookie("jwt").redirect("/");

// There are the two ways how you could make sure the logout router handler thorugh replacing the jwt token while overwriting and settign the m axage 1 millsecong and seconf way is just to ClearCoookie;

// in this lecture you would learn how to implent the comment section in your applications and how to add or combined all the databases together using the monogoose or by the referal of the collecitons of the same datbases and let me know you that there is new thing that i have learnt is that there is functions that is populate basically it fetches all the data regarding the id from the another user and append wuth the current one you are demanding.

const express = require("express");
const app = express();
const ejs = require("ejs");
const multer = require("multer");
const { User } = require("./models/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/ProfileImage/`));
  },
  filename: function (req, file, cb) {
    const FileName = `${Date.now()}-${file.originalname}`;
    cb(null, FileName);
  },
});

const UploadingProfileImage = multer({ storage: storage });

const PORT = process.env.PORT || 8000;

const path = require("path");
const cookieParser = require("cookie-parser");
const { connect } = require("mongoose");

const { CheckAuth } = require("./Middleware/auth");
const { Blog } = require("./models/blog");
// Importing Router
const { UserRouter } = require("./routes/user");
const { router } = require("./routes/blog");

//Middlware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(CheckAuth);

// you have to  inform the express which files are suppose to be rendered
app.use(express.static(path.resolve("./public")));

// Set the views directory to EJsFile
app.set("views", path.join(__dirname, "EjsFile")); // Use the absolute path to the new folder
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  // console.log(req.user);
  if (req.user) {
    const AllBlogs = await Blog.find({});

    res.render("home", { User: req.user, AllBlogs: AllBlogs });
  } else {
    res.render("home", { User: null, AllBlogs: null });
  }
  // No need for .ejs extension
});

// handling the routes for uplaoding the profile Imgae
app.post(
  "/uploads",
  UploadingProfileImage.single("ProfileImage"),
  async (req, res) => {
    // console.log(req.file);
    // console.log("/ProfileImage/".concat(req.file.filename));
    const path = "/ProfileImage/".concat(req.file.filename);

    const user = await User.findByIdAndUpdate(req.user._id, {
      ProfileImageUrl: path,
    });
    // console.log(user);

    return res.redirect("/");
  }
);

// Connectin the mongoDb
connect(process.env.MONGO_URL).then((value) => {
  console.log("Mngodb has been connected");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});

// hanlding Routing
app.use("/user", UserRouter);
app.use("/", router);
