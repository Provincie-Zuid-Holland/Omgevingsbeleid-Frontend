import {
    render,
    screen,
    waitForElementToBeRemoved,
    fireEvent,
} from "@testing-library/react"
import { ToastContainer } from "react-toastify"
import React from "react"
import PopUpModules from "./PopUpModules"

import { beleidsmodules } from "./../../mocks/data/beleidsmodules"

describe("PopUpModules", () => {
    const setDataObjectMock = jest.fn()
    const setDimensionHistoryMock = jest.fn()
    const toggleModulesPopupMock = jest.fn()
    const defaultProps = {
        dataObject: {
            UUID: "0001",
            Ref_Beleidsmodules: [],
        },
        setDimensionHistory: setDimensionHistoryMock,
        dimensionHistory: [{ UUID: "0001" }],
        setDataObject: setDataObjectMock,
        toggleModulesPopup: toggleModulesPopupMock,
        titleSingular: "Beleidskeuze",
    }

    const setup = async () => {
        render(
            <div>
                <ToastContainer limit={1} position="bottom-left" />
                <PopUpModules {...defaultProps} />)
            </div>
        )
    }

    it("should render", async () => {
        setup()
        const text = screen.queryByText("Module aanpassen")
        expect(text).toBeTruthy()
    })

    it("User can add or change the module", async () => {
        setup()
        await waitForElementToBeRemoved(() =>
            screen.queryByTestId("select-loader")
        )

        const select = await screen.findByRole("combobox")
        fireEvent.change(select, {
            target: { value: beleidsmodules[1].UUID },
        })
        expect(select.value).toBe(beleidsmodules[1].UUID)

        const changeModuleBtn = screen.queryByText("Aanpassen")
        expect(changeModuleBtn).toBeTruthy()
        fireEvent.click(changeModuleBtn)
        expect(toggleModulesPopupMock).toHaveBeenCalledTimes(1)

        const toast = await screen.findByText(
            `Beleidskeuze toegevoegd aan module '${beleidsmodules[1].Titel}'`
        )
        expect(toast).toBeTruthy()
        expect(setDataObjectMock).toHaveBeenCalledTimes(1)
    })
})
