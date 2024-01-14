const jwt = require("jsonwebtoken");
const User = require("../modals/userModal");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler (async ( req , res , next ) =>{
    let token;


    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          token = req.headers.authorization.split(" ")[1];  // In the form {Bearer klamlks bkakjsa} we  dont want the word Bearer 
    
          //decodes token id
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
          req.user = await User.findById(decoded.id).select("-password"); // Dont want password
    
          next();
        } catch (error) {
          res.status(401);
          throw new Error("Not authorized, token failed");
        }
      }
    
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
    });
    
    module.exports = { protect };