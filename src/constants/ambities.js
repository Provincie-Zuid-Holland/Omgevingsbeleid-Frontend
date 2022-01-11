import { currentDate, futureDate, currentDateFormatted } from "./testValues"

export const TITLE_SINGULAR = "Ambitie"
export const TITLE_SINGULAR_PREFIX = "de"
export const TITLE_PLURAL = "Ambities"
export const API_ENDPOINT = "ambities"
export const API_ENDPOINT_VIGEREND = "valid/ambities"
export const SLUG_OVERVIEW = "ambities"
export const SLUG_CREATE_NEW = "nieuwe-ambitie"
export const DESCRIPTION =
    "De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie."

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: "Vul een titel in",
        testValue: `Test ambitie ${currentDateFormatted}`,
        type: "text input",
    },
    Omschrijving: {
        initValue: null,
        required: false,
        requiredMessage: "",
        testValue: "Omschrijving",
        type: "text input",
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: "",
        testValue: "Weblink",
        type: "text input",
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: "Vul een datum van inwerkingstreding in",
        testValue: currentDate,
        type: "date input",
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: "Vul een datum van uitwerkingstreding in",
        testValue: futureDate,
        type: "date input",
    },
}
