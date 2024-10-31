import {
  redirect,
  Form,
  useSearchParams,
  useActionData
} from "react-router-dom"

import auth from "../modules/auth"

export async function loader() {
  if (await auth.isLoggedIn) return redirect("/app")
  return null
}

export async function action({ request }) {
  const data = await request.formData()

  const loginData = await auth.login(data.get("username"), data.get("password"))

  if (loginData.success) {
    const redirectTo = data.get("redirectTo") || "/app"
    return redirect(redirectTo)
  } else {
    console.log("errors", loginData)
    return { errors: loginData.errors }
  }
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const actionData = useActionData()

  return (
    <div>
      Please log in...
      <Form action="/login" method="POST">
        <input
          type="hidden"
          value={searchParams.get("redirectTo") || undefined}
          name="redirectTo"
        />

        <input type="text" name="username" />

        <input type="password" name="password" />
        <button>login</button>
      </Form>
      <output>
        {actionData
          ? actionData.errors.map((err) => <div>{err.msg}</div>)
          : null}
      </output>
    </div>
  )
}
