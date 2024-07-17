const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");


const UserSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    ProfileImageUrl: {
      type: String,
      default: "/images/UserAvatar.png",
     
      
      
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();

  // console.log(salt);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.static("loginAndGenerateToken", async function (email, password) {
  const user = await this.findOne({
    email,
  });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      // const sanitizedUser = user.toObject();
      // sanitizedUser.password = undefined;
      // sanitizedUser.email = undefined;
      // return sanitizedUser;
      return user;
    } else {
      throw Error("Incoorrct password");
    }
  } else {
    throw Error("incorrect Email");
  }
});
const User = model("User", UserSchema);
module.exports = {
  User,
};
