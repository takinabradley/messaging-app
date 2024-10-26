import "dotenv/config"
import mongoose from "mongoose"
import User from "./models/User.js"
import bcrypt from "bcryptjs"

mongoose
  .connect(process.env.MONGO_TEST_URI || process.env.MONGO_PROD_URI || "")
  .then(async () => {
    await User.create({
      username: "me",
      hash: bcrypt.hashSync("hellothere")
    })
    console.log("user created")
  })
  .catch(() => {
    console.log("something went wrong")
  })
