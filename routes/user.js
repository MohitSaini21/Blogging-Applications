const { Router } = require("express");
const { User } = require("../models/user");
const UserRouter = Router();
const JWT = require("jsonwebtoken");

// bulding the token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return JWT.sign({ id }, "secret string", {
    expiresIn: maxAge,
  });
};

UserRouter.get("/signin", (req, res) => {
  return res.render("signin");
});
UserRouter.get("/signup", (req, res) => {
  return res.render("signup");
});
UserRouter.post("/signup", async (req, res) => {
  const { FullName, email, password } = req.body;

  try {
    const NewUser = await User.create({
      FullName: FullName,
      email: email,
      password: password,
    });
    console.log("NewUser has been created");
    console.log(NewUser);

    return res.redirect("/");
  } catch (err) {
    console.log(
      "There is an error in saving the documents into the databasee",
      err
    );
  }
});
UserRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.loginAndGenerateToken(email, password);
    const token = createToken(user._id);
    try {
      res
        .cookie("jwt", token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        })
        .redirect("/");
    } catch (err) {
      console.log(
        "There is an error in setting the cokkie or in giving the proper response"
      );
    }
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("password")) {
      res.render("signin", { error: "Incorrect Password" });
    }
    if (!err.message.includes("password")) {
      res.render("signin", { error: "Incorrect Email" });
    }
  }
});

UserRouter.get("/logout", (req, res) => {
  //   res
  //   .cookie("jwt","logout", {
  //     httpOnly: true,
  //     maxAge: 1,
  //   })
  //   .redirect("/");
  // })

  res.clearCookie("jwt").redirect("/");
});
module.exports = {
  UserRouter,
};
