import mongoose from "mongoose";

// Define the schema for documents
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Document title is required"],
  },
  filePath: {
    type: String,
    required: [true, "Document file path is required"],
  },
});

// Define the schema for lectures
const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lecture title is required"],
  },
  avatar: {
    type: String,
    required: [true, "Lecture avatar is required"],
  },
});

// Define the schema for test papers
const testPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Test paper title is required"],
  },
  filePath: {
    type: String,
    required: [true, "Test paper file path is required"],
  },
});

// Define the schema for courses
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numberOfLectures: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    documents: [documentSchema],
    lectures: [lectureSchema],
    testPapers: [testPaperSchema],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
