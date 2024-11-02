import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import browserRouter from "./modules/browserRouter.js"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={browserRouter} />
  </StrictMode>
)
