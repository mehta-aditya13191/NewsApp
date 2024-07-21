import { mongoose } from "mongoose";
import "dotenv/config";
import colors from "colors";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(console.log(`DB Connected Successfully`.bgGreen.white))
    .catch((err) => {
      console.log(`Error in Mongodb ${err}`.bgRed.white);
    });
};

export default connectDB;
