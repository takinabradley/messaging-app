import {
  redirect,
  Form,
  useParams,
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

  const registerData = await auth.register(
    data.get("username"),
    data.get("password"),
    data.get("verifyPassword")
  )

  if (registerData.success) {
    return redirect("/app")
  } else {
    return { errors: registerData.errors }
  }
}

export default function RegisterPage() {
  const actionData = useActionData()

  return (
    <div className="RegisterPage" data-testid="RegisterPage">
      Please register...
      <Form action="/register" method="POST" name="RegisterPage__form" id="RegisterPage__form">
        <label htmlFor="RegisterPage__username">
          username
          <input type="text" name="username" id="RegisterPage__username"/>
        </label>

        <label htmlFor="RegisterPage__password">
          password
          <input type="password" name="password" id="RegisterPage__password"/>
        </label>
        <label htmlFor="RegisterPage__verifyPassword" >
          Confirm Password:
          <input type="password" name="verifyPassword" id="RegisterPage__verifyPassword"/>
        </label>
        <button>register</button>
      </Form>
      <output form="RegisterPage__form">
        {actionData && actionData.errors
          ? actionData.errors.map((err) => (
              <div key={err.msg}>
                {err.path}: {err.msg}
              </div>
            ))
          : null}
      </output>
    </div>
  )
}
