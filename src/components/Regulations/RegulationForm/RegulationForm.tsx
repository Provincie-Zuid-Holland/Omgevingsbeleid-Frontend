import * as contents from '@/config/regulations/contents'
import { Section } from '@/config/regulations/sections/types'
import { Structure } from '@/config/regulations/types'
import useModalStore from '@/store/modalStore'
import {
    Button,
    Divider,
    FormikInput,
    Heading,
    PillButton,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { ArrayHelpers, FieldArray, Form, Formik } from 'formik'
import { Fragment } from 'react'
import RegulationField from './components/RegulationField'

interface RegulationFormProps {
    initialValues: Structure & { label?: string }
    handleFormSubmit: (payload: Structure) => void
    title: string
    section: Section
}

const RegulationForm = ({
    initialValues,
    handleFormSubmit,
    title,
    section,
}: RegulationFormProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            enableReinitialize>
            {({ values }) => (
                <Form>
                    <div className="flex flex-col gap-6">
                        <div>
                            <Heading
                                level="3"
                                size="m"
                                color="text-pzh-blue-dark"
                                className="mb-3">
                                {title}
                            </Heading>

                            <div className="flex gap-4">
                                <div className="w-40">
                                    <FormikInput
                                        name="label"
                                        label="Label"
                                        disabled
                                    />
                                </div>
                                <div className="w-20">
                                    <FormikInput
                                        name="index"
                                        label="Nummer"
                                        disabled
                                    />
                                </div>
                                <div className="flex-1">
                                    <FormikInput
                                        name="title"
                                        label="Opschrift"
                                    />
                                </div>
                            </div>
                        </div>

                        {section.contents?.length && (
                            <>
                                <Divider className="my-0 bg-pzh-gray-600" />
                                <Heading
                                    level="3"
                                    size="m"
                                    color="text-pzh-blue-dark">
                                    Inhoud
                                </Heading>

                                <FieldArray
                                    name="contents"
                                    render={(arrayHelpers: ArrayHelpers) => (
                                        <>
                                            {values.contents?.map(
                                                ({ type }, index) => {
                                                    const content =
                                                        contents[type]

                                                    return (
                                                        <Fragment
                                                            key={type + index}>
                                                            <RegulationField
                                                                type={type}
                                                                index={index}
                                                                name={`contents[${index}]`}
                                                                label={
                                                                    content.name
                                                                }
                                                                handleRemove={() =>
                                                                    arrayHelpers.remove(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                            <Divider className="bg-pzh-gray-300 py-0" />
                                                        </Fragment>
                                                    )
                                                }
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                {section.contents?.map(type => {
                                                    const content =
                                                        contents[type]

                                                    return (
                                                        <PillButton
                                                            key={type}
                                                            icon={Plus}
                                                            onPress={() =>
                                                                arrayHelpers.push(
                                                                    {
                                                                        type,
                                                                    }
                                                                )
                                                            }>
                                                            {content.name}
                                                        </PillButton>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    )}
                                />
                            </>
                        )}

                        <div className="flex items-center justify-between border-t border-pzh-gray-600 pt-4">
                            <Button
                                variant="link"
                                onPress={() => setActiveModal(null)}>
                                Annuleren
                            </Button>
                            <Button variant="cta" type="submit">
                                Opslaan
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default RegulationForm
