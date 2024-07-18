import Jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const authToken = req.headers["authorization"];

    if (!authToken || !authToken.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized , please login again", 401));
    }

    const token = authToken.split(" ")[1];

    if (!token) {
      return next(new AppError("Unauthorized, please login again", 401));
    }

    const userDetails = await Jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: userDetails.id,
      email: userDetails.email,
      role: userDetails.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      redirectTo: "http://127.0.0.1:5500/client/login/login.html",
      success: false,
      message: "Not authorized",
    });
  }
};

export default isLoggedIn;
