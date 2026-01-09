export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.accountType)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to access this route",
    });
  }
  next();
};
