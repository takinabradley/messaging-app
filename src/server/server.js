import app from "./app.js"
import ViteExpress from "vite-express"

ViteExpress.listen(app, process.env.PORT || 3000, () =>
  console.log("Server is listening on port 3000...")
)
