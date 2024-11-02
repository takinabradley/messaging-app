import { Router } from "express"
const apiRouter = Router()

apiRouter.get("/users/:userId", () => {
  if (!req.user) return res.status(401).json({})
})

apiRouter.use((err, req, res, next) => {
  if (err) return res.status(500).json({ message: err?.message || "Something went wrong!" })
  next()
})

export default apiRouter
