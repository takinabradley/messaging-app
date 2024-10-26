import { redirect, Form, useParams, useSearchParams } from "react-router-dom"

/* export function loader({ params, request }) {}

export async function action({ request, params }) {
  const data = await request.formData()
  const redirectTo = data.get("redirectTo") || "/App"
  isLoggedIn = true

  return redirect(redirectTo)
} */

export default function LoginPage() {
  const [searchParams] = useSearchParams()
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
    </div>
  )
}
