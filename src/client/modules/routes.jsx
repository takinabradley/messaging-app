import { redirect } from "react-router-dom"

import MessengerApp, {
  loader as MessengerAppLoader
} from "../components/MessengerApp.jsx"

import AccountPage, {
  loader as AccountPageLoader
} from "../components/AccountPage.jsx"

import InformationalPage from "../components/InformationalPage.jsx"

import LoginPage, {
  loader as LoginPageLoader,
  action as LoginPageAction /* action as loginPageAction */
} from "../components/LoginPage.jsx"

import RegisterPage, {
  loader as RegisterPageLoader,
  action as RegisterPageAction
} from "../components/RegisterPage.jsx"

import auth from "./auth.js"

const routes = [
  {
    path: "/",
    element: <InformationalPage />
  },
  {
    path: "/app",
    loader: MessengerAppLoader,
    element: <MessengerApp />
  },
  {
    path: "/account",
    loader: AccountPageLoader,
    element: <AccountPage />
  },
  {
    path: "/login",
    loader: LoginPageLoader,
    action: LoginPageAction,
    element: <LoginPage />
  },
  {
    path: "/register",
    loader: RegisterPageLoader,
    action: RegisterPageAction,
    element: <RegisterPage />
  },
  {
    path: "/logout",
    loader: async ({ params, request }) => {
      await auth.logout()
      return redirect("/")
    }
  }
]

export default routes
