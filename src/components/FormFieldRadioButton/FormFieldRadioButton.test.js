import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import FormFieldRadioButton from "./FormFieldRadioButton"

describe("FormFieldRadioButton", () => {
    const defaultProps = {}
    const mockHandleChange = jest.fn()

    const titleSingular = "Maatregel"
    const options = ["Gebiedsspecifiek", "Generiek"]
    const fieldValue = "Gebiedsspecifiek"
    const secondOption = "Generiek"
    const dataObjectProperty = "Specifiek_Of_Generiek"

    it("should render", () => {
        const props = { ...defaultProps }

        const { queryByText } = render(
            <FormFieldRadioButton
                options={options}
                handleChange={mockHandleChange}
                fieldValue={fieldValue}
                dataObjectProperty={dataObjectProperty}
                titleSingular={titleSingular}
                label="Intentie van het werkingsgebied"
                {...props}
            />
        )
        expect(queryByText("Gebiedsspecifiek")).toBeTruthy()
    })

    it("Should be checked when options include fieldValue", () => {
        const props = { ...defaultProps }
        const id = `form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}-${
            options[0]
        }`
        render(
            <FormFieldRadioButton
                options={["Gebiedsspecifiek", "Generiek"]}
                handleChange={mockHandleChange}
                fieldValue={fieldValue}
                dataObjectProperty={dataObjectProperty}
                titleSingular={titleSingular}
                label="Intentie van het werkingsgebied"
                {...props}
            />
        )

        const otherInput = screen.getByDisplayValue(secondOption)
        fireEvent.click(otherInput)
    })
})
