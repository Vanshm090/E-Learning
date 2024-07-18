import express from "express";
import userRoute from "./routers/user.routes.js";
import courseRoute from "./routers/course.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // or 'http://localhost:5500'
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));

app.use("/ping", (req, res) => {
  res.send("Server Up!!");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRoute);

app.all("*", (req, res) => {
  res.status(404).send("Oops! 404 Page Not Found");
});

app.use(errorMiddleware);

export default app;
