import auth from "../../auth"
import { redirect } from "react-router-dom"

export default async function redirectIfLoggedOut({ request, params }) {
  const url = new URL(request.url)
  return (await auth.isLoggedIn)
    ? null
    : redirect("/login" + `?redirectTo=${url.pathname}`)
}
