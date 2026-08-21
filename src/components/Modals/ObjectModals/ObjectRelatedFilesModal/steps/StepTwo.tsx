import { DynamicField } from '@/config/types'
import {
    Button,
    FieldInput,
    FieldLabel,
    FormikCheckbox,
    FormikInput,
    Heading,
    Text,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { StepProps } from './types'

export const StepTwo = ({
    model,
    objectData,
    fileName,
    setFileName,
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
                <FileField
                    name="uploaded_file"
                    label="Upload nieuw bestand"
                    description="Selecteer een PDF bestand om aan het beleidsdoel te koppelen. Max 20MB."
                    hasAvgWarning={avgWarning}
                    defaultValue={fileName}
                    setDefaultValue={setFileName}
                    onFileChange={() => setAvgWarning(false)}
                    placeholder="Geen bestand geselecteerd"
                    required
                />
            </div>
        </div>
    </>
)

const FileField = ({
    label,
    name,
    description,
    required,
    hasAvgWarning,
    defaultValue,
    setDefaultValue,
    onFileChange,
    placeholder,
}: Omit<DynamicField, 'type'> & {
    hasAvgWarning?: boolean
    defaultValue?: string
    setDefaultValue: (defaultValue?: string) => void
    onFileChange: () => void
}) => {
    const { setFieldValue, setFieldTouched, errors, touched } =
        useFormikContext<{ uploaded_file?: string }>()

    const hasError = !!errors.uploaded_file && !!touched.uploaded_file
    const errorMessage = hasError
        ? (errors.uploaded_file as unknown as string)
        : undefined

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <div className="relative flex gap-2">
                <div className="flex-1">
                    <FieldInput
                        key={defaultValue}
                        name={name}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        hasError={hasError}
                    />
                </div>
                <Button>Selecteer bestand</Button>
                <div className="absolute top-0 left-0 h-full w-full opacity-0">
                    <input
                        name={name}
                        className="h-full w-full cursor-pointer"
                        type="file"
                        accept="application/pdf"
                        onClick={e => {
                            e.currentTarget.value = ''
                        }}
                        onChange={e => {
                            const file = e.currentTarget.files?.[0]
                            if (!file) return

                            setDefaultValue(file.name)
                            onFileChange()

                            setFieldValue(name, file).then(() =>
                                setFieldTouched(name, true)
                            )
                        }}
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="mt-1 flex flex-col gap-1">
                    {errorMessage.split('\n').map((line, index) => (
                        <span
                            key={index}
                            className="text-pzh-red-500 text-s block">
                            {line}
                        </span>
                    ))}
                </div>
            )}

            {hasAvgWarning && (
                <div className="mt-2">
                    <FormikCheckbox name="ignore_report">
                        Ik ben mij ervan bewust dat het document een auteur
                        heeft, en ik verspreid hiermee geen naam of namen van
                        mij of mijn collega's.
                    </FormikCheckbox>
                </div>
            )}
        </>
    )
}
