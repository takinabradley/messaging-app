import express from "express"
import ViteExpress from "vite-express"
import passport from "passport"
import LocalStrategy from "passport-local"
import User from "./models/User.js"
import mongoose from "mongoose"
import "dotenv/config"
import bcrypt from "bcryptjs"
import session from "express-session"
import connectMongoDBSession from "connect-mongodb-session"
import apiRouter from "./routes/api.js"

const MS_PER_DAY = 8.64e7

/* 
DB CONNECTION
*/
const mongoUri = process.env.MONGO_TEST_URI || process.env.MONGO_PROD_URI || ""
mongoose.connect(mongoUri).then(
  () => console.log("Successfully connected to MongoDB"),
  (err) => {
    throw err
  }
)

/* General middleware configuration */
const app = express()

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
      httpOnly: true,
      secure: process.env.USE_HTTP !== "true",
      maxAge: MS_PER_DAY
    }
  })
)

/* PASSPORT */
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username })
      if (!user) return done(null, false)
      if (!bcrypt.compareSync(password, user.hash)) {
        return done(null, false)
      }
      return done(null, user)
    } catch (e) {
      return done(e)
    }
  })
)

passport.serializeUser((req, user, done) => {
  done(null, { id: user._id })
})

passport.deserializeUser(async function (user, cb) {
  /* console.log("user is", user) */
  const userData = await User.findOne({ _id: user.id })
  /*   console.log("userData is", userData) */
  return cb(null, userData)
})

app.use(passport.authenticate("session")) // needed for things like req.logout

app.use("/api", apiRouter)

ViteExpress.listen(app, process.env.PORT || 3000, () =>
  console.log("Server is listening on port 3000...")
)
