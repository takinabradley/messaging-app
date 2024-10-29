import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"

import MessengerApp from "./components/MessengerApp.jsx"
import AccountPage from "./components/AccountPage.jsx"
import InformationalPage from "./components/InformationalPage.jsx"
import LoginPage /* action as loginPageAction */ from "./components/LoginPage.jsx"

import auth from "./modules/auth.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <InformationalPage />
  },
  {
    path: "/app",
    loader: async ({ request, params }) => {
      const url = new URL(request.url)
      return (await auth.isLoggedIn)
        ? null
        : redirect("/login" + `?redirectTo=${url.pathname}`)
    },
    element: <MessengerApp />
  },
  {
    path: "/account",
    loader: async ({ request, params }) => {
      const url = new URL(request.url)
      return (await auth.isLoggedIn)
        ? null
        : redirect("/login" + `?redirectTo=${url.pathname}`)
    },
    element: <AccountPage />
  },
  {
    path: "/login",
    loader: async () => {
      if (await auth.isLoggedIn) return redirect("/app")
      return null
    },
    action: async function action({ request, params }) {
      const data = await request.formData()
      let loginData = await auth.login(
        data.get("username"),
        data.get("password")
      )

      if (loginData.loggedIn) {
        const redirectTo = (await auth.isLoggedIn)
          ? data.get("redirectTo") || "/app"
          : "/login"

        return redirect(redirectTo)
      } else {
        return null
      }
    },
    element: <LoginPage />
  },
  {
    path: "/logout",
    loader: async ({ params, request }) => {
      await auth.logout()
      return redirect("/")
    }
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
