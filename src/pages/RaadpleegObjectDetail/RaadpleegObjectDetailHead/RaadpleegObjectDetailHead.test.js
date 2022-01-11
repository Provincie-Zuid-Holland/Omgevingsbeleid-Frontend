import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"

import RaadpleegObjectDetailHead from "./RaadpleegObjectDetailHead"

describe("RaadpleegObjectDetailHead", () => {
    const defaultProps = {
        dataObject: {
            Titel: "Test Titel",
        },
        titleSingular: "Singular",
    }

    const setup = (customProps) => {
        const props = { ...defaultProps, ...customProps }
        render(<RaadpleegObjectDetailHead {...props} />)
    }

    it("Component renders", () => {
        setup()
        expect(document.title).toEqual(
            `${defaultProps.dataObject.Titel} (${defaultProps.titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
        )
    })
})
