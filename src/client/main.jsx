import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"

import MessengerApp from "./components/MessengerApp.jsx"
import AccountPage from "./components/AccountPage.jsx"
import InformationalPage from "./components/InformationalPage.jsx"
import LoginPage /* action as loginPageAction */ from "./components/LoginPage.jsx"

const auth = {
  isLoggedIn: false,
  login(username, password) {
    this.isLoggedIn = true
  },
  logout() {
    this.isLoggedIn = false
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <InformationalPage />
  },
  {
    path: "/app",
    loader: ({ request, params }) => {
      const url = new URL(request.url)
      return auth.isLoggedIn
        ? null
        : redirect("/login" + `?redirectTo=${url.pathname}`)
    },
    element: <MessengerApp />
  },
  {
    path: "/account",
    loader: ({ request, params }) => {
      const url = new URL(request.url)
      return auth.isLoggedIn ? null : redirect("/")
    },
    element: <AccountPage />
  },
  {
    path: "/login",
    loader: () => {
      if (auth.isLoggedIn) return redirect("/app")
      return null
    },
    action: async function action({ request, params }) {
      const data = await request.formData()
      auth.login(data.get("username"), data.get("password"))
      console.log()
      const redirectTo = auth.isLoggedIn
        ? data.get("redirectTo") || "/app"
        : "/login"

      console.log(redirectTo)

      return redirect(redirectTo)
    },
    element: <LoginPage />
  },
  {
    path: "/logout",
    loader: ({ params, request }) => {
      auth.logout()
      return redirect("/")
    }
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
