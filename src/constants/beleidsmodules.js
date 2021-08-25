import { currentDateFormatted } from "./testValues"

export const TITLE_SINGULAR = "Beleidsmodule"
export const TITLE_SINGULAR_PREFIX = "de"
export const TITLE_PLURAL = "Beleidsmodules"
export const API_ENDPOINT = "beleidsmodules"
export const SLUG_OVERVIEW = "beleidsmodules"
export const SLUG_CREATE_NEW = "nieuwe-beleidsmodule"

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: "Vul een titel in",
        testValue: `Test beleidsdoel ${currentDateFormatted}`,
        type: "text input",
    },
}
