import AppError from "../utils/error.util.js";
import Course from "../models/course.model.js";
import uploadOnCloudinary from "../utils/cloudinary.util.js";

const createCourse = async (req, res, next) => {
  const { title, description, numberOfLectures, category, createdBy } =
    req.body;

  if (!title || !description || !numberOfLectures || !category || !createdBy) {
    return next(new AppError("All feilds are required", 400));
  }

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    return next(new AppError("thumbnail Required!!", 400));
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    return next(new AppError("thumbnail Required!!", 500));
  }
  try {
    const course = await Course.create({
      title,
      description,
      numberOfLectures,
      category,
      createdBy,
      thumbnail: thumbnail.url,
    });
    res.status(200).json({
      success: true,
      message: "Course created successfully!!",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(" Course Creation failed, please try again", 400));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const courseid = req.params.id;

    const course = await Course.findByIdAndUpdate(
      courseid,
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!course) {
      return next(new AppError("course not exist", 400));
    }

    res.status(200).json({
      success: true,
      message: "Course Updateded successfully!!",
      data: course,
    });
  } catch (error) {
    return next(new AppError("Course updation failed" + error.message, 400));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    console.log(courseId);

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Course deletion failed", 500));
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const createLectures = async (req, res, next) => {
  const { title } = req.body;
  console.log(req.body);
  console.log(req.file);

  const courseId = req.params.id;

  if (!title) {
    return next(new AppError("Title and description are required", 400));
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return next(new AppError("Avatar is required for the lecture", 400));
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    return next(new AppError("Failed to upload avatar for the lecture", 500));
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    course.lectures.push({
      title,
      avatar: avatar.url,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture created successfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError("Lecture creation failed, please try again", 400));
  }
};
const createDocuments = async (req, res, next) => {
  const { title, description } = req.body;
  const courseId = req.params.id;

  if (!title || !description) {
    return next(new AppError("Title and description are required", 400));
  }

  const documentLocalPath = req.file?.path;
  if (!documentLocalPath) {
    return next(new AppError("Document file is required", 400));
  }

  const document = await uploadOnCloudinary(documentLocalPath);
  if (!document) {
    return next(new AppError("Failed to upload document file", 500));
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    course.documents.push({
      title,
      description,
      filePath: document.url,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Document added successfully",
      data: course,
    });
  } catch (error) {
    return next(
      new AppError("Document addition failed, please try again", 400)
    );
  }
};
const createTestPapers = async (req, res, next) => {
  const { title, description } = req.body;
  const courseId = req.params.id;

  if (!title || !description) {
    return next(new AppError("Title and description are required", 400));
  }

  const testPaperLocalPath = req.file?.path;
  if (!testPaperLocalPath) {
    return next(new AppError("Test paper file is required", 400));
  }

  const testPaper = await uploadOnCloudinary(testPaperLocalPath);
  if (!testPaper) {
    return next(new AppError("Failed to upload test paper file", 500));
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    course.testPapers.push({
      title,
      description,
      filePath: testPaper.url,
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Test paper added successfully",
      data: course,
    });
  } catch (error) {
    return next(
      new AppError("Test paper addition failed, please try again", 400)
    );
  }
};

const getAllLectures = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    console.log(courseId);

    const course = await Course.findById(courseId);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All lectures fetched successfully",
      data: course.lectures,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal Server Error", 500));
  }
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourse,
  getAllLectures,
  createLectures,
  createTestPapers,
  createDocuments,
};
