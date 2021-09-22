import { render } from "@testing-library/react"
import React from "react"
import RaadpleegUniversalObjectOverview from "./RaadpleegUniversalObjectOverview"

describe("RaadpleegUniversalObjectOverview", () => {
    const defaultProps = {}

    it("should render", () => {
        const props = { ...defaultProps }
        const { asFragment, queryByText } = render(
            <RaadpleegUniversalObjectOverview {...props} />
        )
    })
})
