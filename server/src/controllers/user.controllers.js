import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import uploadOnCloudinary from "../utils/cloudinary.util.js";

const register = async (req, res) => {
  const { Name, email, password } = req.body;
  if (!Name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res
      .status(400)
      .json({ success: false, message: "User already registered!" });
  }

  // const avatarLocalPath = req.file?.path;
  // if (!avatarLocalPath) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Avatar required!" });
  // }

  try {
    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // if (!avatar) {
    //   return res
    //     .status(500)
    //     .json({ success: false, message: "Failed to upload avatar" });
    // }

    const user = await User.create({
      fullName: Name,
      email,
      password,
      // avatar: avatar.url,
    });
    console.log("User Created:", user);

    const token = await user.generateAuthToken();

    user.password = undefined;

    return res.status(201).json({
      success: true,
      token: token,
      message: "User registered successfully!!",
      data: user,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      success: false,
      message: "User registration failed, please try again",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError(" No user found , please SignUP ", 400));
    }

    const token = await user.generateAuthToken();

    user.password = undefined;

    res.status(200).json({
      success: true,
      token: token,
      user,
      message: "User logged in successfully!!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const logout = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully!!",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getProfile = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    return res.status(200).json({
      success: true,
      message: "user details",
      user,
    });
  } catch (error) {
    return next(new AppError("failed to loadd profile", 400));
  }
};

const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return next(new AppError("User does not exist", 400));
  }
  const avatarLocalPath = await req.file?.path;
  console.log(avatarLocalPath);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    user.fullName = fullName;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated succesfully",
      user,
    });
  } catch (error) {
    return next(new AppError("User updation Failed" + error.message, 400));
  }
};

export { register, login, logout, getProfile, updateUser };
