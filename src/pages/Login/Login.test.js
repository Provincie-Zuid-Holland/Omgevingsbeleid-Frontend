import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import Login from "./Login"
import { MemoryRouter } from "react-router-dom"

const mockSetLoginUser = () => jest.fn()
const mockSetLoginState = () => jest.fn()

describe("Login", () => {
    it("should render", () => {
        render(
            <MemoryRouter>
                <Login
                    setLoginUser={mockSetLoginUser}
                    setLoginState={mockSetLoginState}
                />
            </MemoryRouter>
        )
        const header = screen.getByRole("heading", {
            name: "Inloggen",
        })
        expect(header).toBeInTheDocument()
    })
})
