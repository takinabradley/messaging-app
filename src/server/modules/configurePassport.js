import User from "../models/User.js"
import bcrypt from "bcryptjs"
import LocalStrategy from "passport-local"

export default function configurePassport(passportInstance) {
  passportInstance.use(
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

  passportInstance.serializeUser((req, user, done) => {
    done(null, { id: user._id })
  })

  passportInstance.deserializeUser(async function (user, cb) {
    /* console.log("user is", user) */
    const userData = await User.findOne({ _id: user.id })
    /*   console.log("userData is", userData) */
    return cb(null, userData)
  })

  return passportInstance
}