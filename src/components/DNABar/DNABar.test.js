import { render } from "@testing-library/react"
import React from "react"
import DNABar from "./DNABar"

describe("DNABar", () => {
    const defaultProps = {}

    it("should render", () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(<DNABar {...props} />)
    })
})
