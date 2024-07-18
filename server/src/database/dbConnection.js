import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    if (connection) {
      console.log(`Database Connected Successfully !! : ${connection.host}`);
    }
  } catch (error) {
    console.log("Database Connected Failed !!");
    throw error;
  }
};

export default connectToDb;
