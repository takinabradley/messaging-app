import { describe, expect, it, test } from "vitest";
import LoginPage, {loader as LoginPageLoader, action as LoginPageAction} from "../../components/LoginPage";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import userEvent from "@testing-library/user-event";

describe("LoginPage", () => {
  test("renders", async () => {
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId("LoginPage")).toBeInTheDocument()    
    expect(screen.getByTestId("LoginPage")).toMatchSnapshot()
  })

  test("redirectTo input has the same value as the redirectTo search param", () => {
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
      }
    ], {initialEntries: ["/", "/login?redirectTo=somewhere"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId("LoginPage__redirectTo")).toHaveValue("somewhere")
  })

  test("redirectTo input has no value when there is no redirectTo search param", () => {
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId("LoginPage__redirectTo")).toHaveValue("")
  })

  test("redirectTo input has no value when redirectTo search param is empty", () => {
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
      }
    ], {initialEntries: ["/", "/login?redirectTo"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    expect(screen.getByTestId("LoginPage__redirectTo")).toHaveValue("")
  })

  test("output element shows an error from form action on submit", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: () => ({errors: [{msg: "something went wrong!"}]})
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const loginButton = screen.getByRole("button", {name: "login"})
    await user.click(loginButton)

    expect(screen.getByRole("status").childElementCount).toBe(1)
    expect(screen.getByRole("status").children[0]).toHaveTextContent("something went wrong!")
  })

  test("output element shows multiple errors from the form action", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: () => ({errors: [{msg: "something went wrong!"}, {msg: "another thing went wrong!"}]})
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const loginButton = screen.getByRole("button", {name: "login"})
    await user.click(loginButton)

    expect(screen.getByRole("status").childElementCount).toBe(2)
    expect(screen.getByRole("status").children[0]).toHaveTextContent("something went wrong!")
    expect(screen.getByRole("status").children[1]).toHaveTextContent("another thing went wrong!")
  })

  test("output element shows no error from form action on submit when there is an empty list of errors", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: () => ({errors: []})
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const loginButton = screen.getByRole("button", {name: "login"})
    await user.click(loginButton)

    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("doesn't break when action returns nothing", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: () => null
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const loginButton = screen.getByRole("button", {name: "login"})
    await user.click(loginButton)

    expect(screen.getByTestId("LoginPage")).toBeInTheDocument()
    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("doesn't break when action returns empty errors field", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: () => ({errors: undefined})
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const loginButton = screen.getByRole("button", {name: "login"})
    await user.click(loginButton)

    expect(screen.getByTestId("LoginPage")).toBeInTheDocument()
    expect(screen.getByRole("status").childElementCount).toBe(0)
  })

  test("users are able to submit username and password to form action", async () => {
    const user = userEvent.setup()

    let resolveUserCredentials = null
    const userCredentials = new Promise((res, rej) => {
      resolveUserCredentials = res
    })

    const router = createMemoryRouter([
      {
        path: "/login",
        element: <LoginPage />,
        action: async ({request}) => {
          const data = await request.formData()
          resolveUserCredentials({username: data.get("username"), password: data.get("password")})
          return null
        }
      }
    ], {initialEntries: ["/", "/login"], initialIndex: 1})

    render(<RouterProvider router={router} />)

    const usernameField = screen.getByRole("textbox", {name: "username"})
    const passwordField = screen.getByLabelText("password")
    const loginButton = screen.getByRole("button", {name: "login"})

    await user.type(usernameField, "hello")
    await user.type(passwordField, "there")
    await user.click(loginButton)

    const formData = new FormData(screen.getByRole("form"))
    expect((await userCredentials).username).toBe("hello")
    expect((await userCredentials).password).toBe("there")
  })
})