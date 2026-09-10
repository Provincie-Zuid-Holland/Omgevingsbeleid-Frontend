import { FormikInput, Heading, Text } from '@pzh-ui/components'

import FieldFile from '@/components/Form/FieldFile'

import { StepProps } from './types'

export const StepTwo = ({
    model,
    objectData,
    avgWarning,
    setAvgWarning,
}: StepProps) => (
    <>
        <Heading level="2" size="xl" className="mb-2">
            Gerelateerde bestanden koppelen
        </Heading>

        <Text className="mb-4">
            Upload een bestand om te koppelen aan{' '}
            {model.defaults.singularReadable}:{' '}
            <Text as="span" bold>
                {objectData?.Title}
            </Text>
        </Text>

        <div className="flex flex-col gap-2">
            <div>
                <FormikInput
                    name="title"
                    label="Titel van bestand"
                    description="De titel wordt zichtbaar voor de bezoekers van de website, in het geval van een beleidsevaluatie is jaartal plus de titel van het beleidsdoel aan te raden."
                    placeholder="[Jaartal] [Titel van beleidsdoel]"
                    required
                />
            </div>
            <div>
                <FieldFile
                    name="uploaded_file"
                    label="Upload nieuw bestand"
                    description="Selecteer een PDF bestand om aan het beleidsdoel te koppelen. Max 20MB."
                    placeholder="Geen bestand geselecteerd"
                    required
                    fileFieldName="uploaded_file"
                    ignoreFieldName="ignore_report"
                    showIgnoreCheckbox={avgWarning}
                    onFileSelect={() => setAvgWarning(false)}
                />
            </div>
        </div>
    </>
)
