import { describe, expect, it, test } from "vitest";
import RegisterPage, {loader as RegisterPageLoader, action as RegisterPageAction} from "../../components/RegisterPage.jsx";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import userEvent from "@testing-library/user-event";

describe("RegisterPage", () => {
  test("renders", async () => {
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId("RegisterPage")).toBeInTheDocument()    
    expect(screen.getByTestId("RegisterPage")).toMatchSnapshot()

  })

  test("output element shows an error from form action on submit", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: () => ({errors: [{path: "unknown", msg: "something went wrong!"}]})
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const registerButton = screen.getByRole("button", {name: "register"})
    await user.click(registerButton)

    expect(screen.getByRole("status").childElementCount).toBe(1)
    expect(screen.getByRole("status").children[0]).toHaveTextContent("unknown: something went wrong!")
  })

  test("output element shows multiple errors from the form action", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: () => ({
            errors: [
                {path: "unknown", msg: "something went wrong!"}, 
                {path: "username", msg: "username already taken!"}
            ]
        })
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)


    const registerButton = screen.getByRole("button", {name: "register"})
    await user.click(registerButton)

    expect(screen.getByRole("status").childElementCount).toBe(2)
    expect(screen.getByRole("status").children[0]).toHaveTextContent("unknown: something went wrong!")
    expect(screen.getByRole("status").children[1]).toHaveTextContent("username: username already taken!")
  })

  test("output element shows no error from form action on submit when there is an empty list of errors", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: () => ({errors: []})
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const registerButton = screen.getByRole("button", {name: "register"})
    await user.click(registerButton)

    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("doesn't break when action returns nothing", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: () => null
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const registerButton = screen.getByRole("button", {name: "register"})
    await user.click(registerButton)

    expect(screen.getByTestId("RegisterPage")).toBeInTheDocument()
    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("doesn't break when action returns empty errors field", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: () => ({errors: undefined})
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const registerButton = screen.getByRole("button", {name: "register"})
    await user.click(registerButton)

    expect(screen.getByTestId("RegisterPage")).toBeInTheDocument()
    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("users are able to submit username, password, and verifyPassword fields to form action", async () => {
    const user = userEvent.setup()

    let resolveUserCredentials = null
    const userCredentials = new Promise((res, rej) => {
      resolveUserCredentials = res
    })

    const router = createMemoryRouter([
      {
        path: "/register",
        element: <RegisterPage />,
        action: async ({request}) => {
          const data = await request.formData()
          resolveUserCredentials({username: data.get("username"), password: data.get("password"), verifyPassword: data.get("verifyPassword")})
          return null
        }
      }
    ], {initialEntries: ["/", "/register"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const usernameField = screen.getByRole("textbox", {name: "username"})
    const passwordField = screen.getByLabelText("password")
    const verifyPasswordField = screen.getByLabelText("Confirm Password:")
    const registerButton = screen.getByRole("button", {name: "register"})

    await user.type(usernameField, "hello")
    await user.type(passwordField, "there")
    await user.type(verifyPasswordField, "there")
    await user.click(registerButton)

    expect((await userCredentials).username).toBe("hello")
    expect((await userCredentials).password).toBe("there")
    expect((await userCredentials).verifyPassword).toBe("there")
  })
})