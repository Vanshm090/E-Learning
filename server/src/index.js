import app from "./app.js";
import connectToDb from "./database/dbConnection.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 8000;
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app is running at localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(" App CONNECTION FAILED !! : ", error);
  });
