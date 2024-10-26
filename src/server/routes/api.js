import { Router } from "express"
import asyncErrorHandler from "express-async-handler"
import passport from "passport"
import { body, validationResult } from "express-validator"
import isAvailableUsername from "../validators/isAvailableUsername.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import matchesPassword from "../validators/matchesPassword.js"

const apiRouter = Router()

apiRouter.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username must be provided")
    .isString()
    .withMessage("username must be a string of characters")
    .trim()
    .notEmpty()
    .withMessage("username must contain one or more non-whitespace characters")
    .escape()
    .custom(isAvailableUsername),
  body("password")
    .exists()
    .withMessage("password must be provided")
    .isString()
    .withMessage("password must be a string of characters")
    .trim()
    .notEmpty()
    .withMessage("password must contain one or more non-whitespace characters")
    .isLength({ min: 0, max: 18 })
    .withMessage("password may not exceed 18 characters"),
  body("verifyPassword").custom(matchesPassword),
  asyncErrorHandler(async (req, res, next) => {
    const validation = validationResult(req)
    if (validation.isEmpty()) {
      const { username, password } = req.body
      const hash = await bcrypt.hash(password, 10)
      const user = new User({ username, hash })
      await user.save()
      return req.login(user, (err) => {
        res.json({ status: "You are a good boy <3" })
      })
    } else {
      return res
        .status(400)
        .json({ status: "BAD! BAD!", errors: validation.array() })
    }
  })
)

apiRouter.get("/loginstatus", (req, res, next) => {
  console.log("user", req.user)
  console.log("session", req.session)
  if (req.user) return res.json({ loggedIn: true })
  return res.json({ loggedIn: false })
})

apiRouter.post(
  "/login",
  body("username")
    .exists()
    .withMessage("username must be provided")
    .isString()
    .withMessage("username must be a string of characters")
    .trim()
    .notEmpty()
    .withMessage("username must contain one or more non-whitespace characters")
    .escape(),
  body("password")
    .exists()
    .withMessage("password must be provided")
    .isString()
    .withMessage("password must be a string of characters")
    .trim()
    .notEmpty()
    .withMessage("password must contain one or more non-whitespace characters"),
  (req, res, next) => {
    // check form info before sending data to passport
    const validation = validationResult(req)
    if (validation.isEmpty()) return next()
    return res
      .status(400)
      .json({ status: "BAD! BAD!", errors: validation.array() })
  },
  passport.authenticate("local"),
  (req, res, next) => {
    if (req.user) return res.json({ loggedIn: true })
    next()
  }
)

apiRouter.post("/logout", function (req, res, next) {
  if (!req.user) return res.json({ loggedIn: false })

  return req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.json({ loggedIn: false })
  })
})

apiRouter.get("/users/:userId", () => {
  if (!req.user) return res.status(401).json({})
})

apiRouter.use((err, req, res, next) => {
  if (err) return res.send(err?.message || "Something went wrong!")
  next()
})

export default apiRouter
