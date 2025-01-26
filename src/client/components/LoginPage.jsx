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
    <div className="LoginPage" data-testid="LoginPage">
      Please log in...
      <Form action="/login" method="POST" id="LoginPage__form" name="loginPage__form">
        <input
          type="hidden"
          value={searchParams.get("redirectTo") || undefined}
          name="redirectTo"
          data-testid="LoginPage__redirectTo"
        />
        <label htmlFor="LoginPage__username">username</label>
        <input type="text" name="username" id="LoginPage__username"/>

        <label htmlFor="LoginPage__password">password</label>
        <input type="password" name="password" id="LoginPage__password"/>
        
        <button>login</button>
      </Form>
      <output name="errors" form="LoginPage__form">
        {actionData && actionData.errors
          ? actionData.errors.map((err) => <div key={err.msg}>{err.msg}</div>)
          : null}
      </output>
    </div>
  )
}
