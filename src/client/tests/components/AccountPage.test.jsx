import { describe, expect, it, test } from "vitest";
import AccountPage from "../../components/AccountPage";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import userEvent from "@testing-library/user-event";

describe("AccountPage", () => {
  test("renders", async () => {
    render(<AccountPage />)

    expect(screen.getByTestId("AccountPage")).toBeInTheDocument()    
    expect(screen.getByTestId("AccountPage")).toMatchSnapshot()
  })
})