import { describe } from "vitest";
import MessengerApp from "../../components/MessengerApp";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

describe("MessengerApp", () => {
    test("renders", async () => {
        const router = createMemoryRouter([
            {
                path: "/",
                element: <MessengerApp />
            }
        ])

        render(<RouterProvider router={router} />)

        expect(screen.getByTestId("MessengerApp")).toBeInTheDocument()
        expect(screen.getByTestId("MessengerApp")).toMatchSnapshot()
    })
})