import express from "express"
import ViteExpress from "vite-express"
import passport from "passport"
import mongoose from "mongoose"
import "dotenv/config"
import session from "express-session"
import connectMongoDBSession from "connect-mongodb-session"

import configurePassport from "./modules/configurePassport.js"
import authRouter from "./routes/auth.js"
import apiRouter from "./routes/api.js"

const MS_PER_DAY = 8.64e7

/* 
DB CONNECTION
*/
const mongoUri = process.env.MONGO_DEV_URI || process.env.MONGO_PROD_URI || ""
mongoose.connect(mongoUri).then(
  () => console.log("Successfully connected to MongoDB"),
  (err) => {
    throw err
  }
)

/* General middleware configuration */
const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* SESSION + SESSION STORE */
const MongoDBStore = connectMongoDBSession(session)
const store = new MongoDBStore({
  uri: mongoUri,
  collection: "expressSessions",
  expires: MS_PER_DAY
})

app.use(
  session({
    secret: process.env.STORE_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    name: "sessionId",
    store: store,
    cookie: {
      path: "/",
      sameSite: true,
      httpOnly: true,
      secure: process.env.USE_HTTP !== "true",
      maxAge: MS_PER_DAY
    }
  })
)

/* PASSPORT */
configurePassport(passport)

app.use(passport.authenticate("session")) // needed for things like req.logout

app.use("/auth", authRouter)
app.use("/api", apiRouter)

export default app

