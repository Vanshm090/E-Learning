import {
  register,
  login,
  logout,
  getProfile,
  updateUser,
} from "../controllers/user.controllers.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import Router from "express";

const userRoute = Router();

userRoute.post("/register", upload.single("avatar"), register);
userRoute.post("/login", login);
userRoute.get("/logout", logout);
userRoute.get("/me", isLoggedIn, getProfile);
userRoute.post("/update", isLoggedIn, upload.single("avatar"), updateUser);

userRoute.get("/token-verify", isLoggedIn, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default userRoute;
