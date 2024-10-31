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
    <div>
      Please register...
      <Form action="/register" method="POST">
        <input type="text" name="username" />

        <input type="password" name="password" />
        <input type="password" name="verifyPassword" />
        <button>login</button>
      </Form>
      <output>
        {actionData
          ? actionData.errors.map((err) => (
              <div>
                {err.path}: {err.msg}
              </div>
            ))
          : null}
      </output>
    </div>
  )
}
