import { describe, expect, it, test } from "vitest";
import InformationalPage from "../../components/InformationalPage";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("AccountPage", () => {
  test("renders", async () => {
    const router = createMemoryRouter([
        {
            path: "/",
            element: <InformationalPage />
        },
    ])
    render(<RouterProvider router={router}/>)

    expect(screen.getByTestId("InformationalPage")).toBeInTheDocument()    
    expect(screen.getByTestId("InformationalPage")).toMatchSnapshot()
  })

  test("Login link directs to /login route", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
        {
            path: "/",
            element: <InformationalPage />
        },
        {
            path: "/login",
            element: "This is the login page"
        },
    ])

    render(<RouterProvider router={router}/>)

    const loginLink = screen.getByRole("link", {name: "login"})
    await user.click(loginLink)

    expect(screen.getByText("This is the login page")).toBeInTheDocument()    
  })

  test("register link directs to /register route", async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([
        {
            path: "/",
            element: <InformationalPage />
        },
        {
            path: "/register",
            element: "This is the register page"
        }
    ])

    render(<RouterProvider router={router}/>)

    const registerLlink = screen.getByRole("link", {name: "register"})
    await user.click(registerLlink)

    expect(screen.getByText("This is the register page")).toBeInTheDocument()    
  })
})
