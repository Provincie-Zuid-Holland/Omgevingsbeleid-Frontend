import { FormikDate, FormikInput, Text } from '@pzh-ui/components'

export const StepOne = () => (
    <div>
        <Text className="mb-4">
            Voordat de module kan worden afgesloten, hebben we de volgende
            gegevens nodig.
        </Text>
        <div className="mt-3">
            <FormikInput
                type="url"
                name="IDMS_Link"
                label="IDMS"
                placeholder="Voer een URL in"
                description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                required
            />
        </div>
        <div className="mt-3">
            <FormikInput
                name="Decision_Number"
                label="Besluitnummer"
                description="Geef hier het PZH besluitnummer."
                required
            />
        </div>
        <div className="mt-3">
            <FormikInput
                type="url"
                name="Link_To_Decision_Document"
                label="Link naar besluitdocument"
                placeholder="Voer een URL in"
                description="Voer hieronder de link in naar het besluit op Notubiz."
                required
            />
        </div>
        <div className="mt-3">
            <FormikDate
                name="Publicatiedatum"
                label="Publicatiedatum"
                placeholder="dd-mm-jjjj"
                description="De datum van publicatie"
                required
            />
        </div>
        <div className="mt-3">
            <FormikDate
                name="Date"
                label="Datum van wijziging"
                placeholder="dd-mm-jjjj"
                description="Geef de datum van wijziging op. In de volgende stap kun je per object de in- en uitwerkingtredingsdatum aanpassen."
                required
            />
        </div>
    </div>
)
