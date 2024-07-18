import AppError from "../utils/error.util.js";

const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
      return next(
        new AppError("You don't have permission to access these routes", 400)
      );
    }
    next();
  };

export default authorizedRoles;
