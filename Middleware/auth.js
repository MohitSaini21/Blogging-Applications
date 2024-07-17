const JWT = require("jsonwebtoken");
const { User } = require("../models/user");

async function CheckAuth(req, res, next) {
  
  const token = req.cookies.jwt;
  let user;

  if (token) {
    // Verifying the token
    JWT.verify(token, "secret string", async (err, decodedToken) => {
      if (err) {
        console.log("Token verification error:", err);
        req.user = null; // Set the user on the request object
        next();
      } else {
        const ID = decodedToken.id;

         user = await User.findById(ID);
        if (!user) {
          return res.redirect("/user/signin");
        }

        req.user = user; // Set the user on the request object
        next(); // Proceed to the next middleware
      }
    });
  } else {
    req.user = null; // Set the user on the request object
    next();
  }
}

module.exports = {
  CheckAuth,
};
