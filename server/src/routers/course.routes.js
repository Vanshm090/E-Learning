import Router from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourse,
  createLectures,
  createDocuments,
  createTestPapers,
  getAllLectures
} from "../controllers/course.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import authorizedRoles from "../middlewares/authorizedRoles.js";

const courseRoute = Router();

courseRoute
  .route("/")
  .get(isLoggedIn, getAllCourse)
  .post(isLoggedIn, createCourse);

courseRoute
  .route("/:id")
  .put(isLoggedIn, authorizedRoles("ADMIN"), updateCourse) //not available
  .delete(isLoggedIn, authorizedRoles("ADMIN"), deleteCourse);

courseRoute
  .route("/:id/lectures")
  .get(isLoggedIn,getAllLectures)
  .post( upload.single("avatar"), createLectures);

courseRoute
  .route("/:id/documents")
  .post(isLoggedIn, upload.single("filePath"), createDocuments);

courseRoute
  .route("/:id/test-papers")
  .post(isLoggedIn, upload.single("filePath"), createTestPapers);

export default courseRoute;
