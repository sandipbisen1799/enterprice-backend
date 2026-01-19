import jwt from "jsonwebtoken";
import env from "../config/env.js";
export const auth = async (req, res, next) => {
  let token;
  try {
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token is missing while accessing  the token from the cookie",
      });
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json(console.error(error), {
      message: "auth server error",
    });
  }
};
