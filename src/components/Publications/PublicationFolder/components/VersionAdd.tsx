import {
    Button,
    formatDate,
    FormikSelect,
    Heading,
    Text,
} from '@pzh-ui/components'
import { PlusLight, XmarkLarge } from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getPublicationsPublicationUuidVersionsGetQueryKey,
    useModulesModuleIdStatusGet,
    usePublicationsPublicationUuidVersionPost,
} from '@/api/fetchers'
import { PublicationVersionCreate } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import { PUBLICATION_VERSION_ADD_SCHEMA } from '@/validation/publication'

interface VersionAddProps {
    publicationUUID: string
}

const VersionAdd = ({ publicationUUID }: VersionAddProps) => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const [isOpen, setIsOpen] = useState(false)

    const { data: moduleStatusOptions = [], isFetching } =
        useModulesModuleIdStatusGet(parseInt(moduleId!), {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data
                        .filter(status => status.Status !== 'Niet-Actief')
                        .sort(
                            (a, b) =>
                                new Date(b.Created_Date + 'Z').getTime() -
                                new Date(a.Created_Date + 'Z').getTime()
                        )
                        .map(status => ({
                            label: `${status.Status} (${formatDate(
                                new Date(status.Created_Date + 'Z'),
                                "dd-MM-yyyy 'om' HH:mm"
                            )})`,
                            value: status.ID,
                        })),
            },
        })

    const { mutate } = usePublicationsPublicationUuidVersionPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationsPublicationUuidVersionsGetQueryKey(
                            publicationUUID
                        ),
                })

                setIsOpen(false)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionCreate) => {
        mutate({ publicationUuid: publicationUUID, data: payload })
    }

    if (isOpen) {
        return (
            <Formik
                initialValues={{} as PublicationVersionCreate}
                onSubmit={handleFormSubmit}
                validationSchema={toFormikValidationSchema(
                    PUBLICATION_VERSION_ADD_SCHEMA
                )}
                enableReinitialize>
                {({ isSubmitting, isValid, submitForm }) => (
                    <Form className="flex flex-col gap-12 border-b border-pzh-gray-200 p-6 last:border-b-0">
                        <div className="flex items-center justify-between">
                            <Heading level="3" size="s">
                                Nieuwe versie aanmaken
                            </Heading>
                            <Button
                                variant="default"
                                onPress={() => setIsOpen(false)}>
                                <XmarkLarge size={16} />
                            </Button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <Text
                                as="label"
                                bold
                                htmlFor="Document_Type"
                                className="text-heading-m text-pzh-blue-500">
                                Modulestatus
                            </Text>
                            <div className="flex w-full justify-center">
                                <div className="max-w-[736px] flex-1">
                                    {isFetching ? (
                                        <LoaderCard mb="" />
                                    ) : (
                                        <FormikSelect
                                            name="Module_Status_ID"
                                            placeholder="Selecteer een modulestatus"
                                            options={moduleStatusOptions}
                                            menuPortalTarget={
                                                document.getElementById(
                                                    'select-version-portal'
                                                ) as HTMLElement
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button
                                size="small"
                                variant="secondary"
                                onPress={() => setIsOpen(false)}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                size="small"
                                type="button"
                                isDisabled={isSubmitting || !isValid}
                                isLoading={isSubmitting}
                                onPress={submitForm}>
                                Versie maken
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }

    return (
        <Button
            onPress={() => setIsOpen(true)}
            variant="default"
            className="flex h-16 w-full border-b border-pzh-gray-200 bg-pzh-gray-100 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-pzh-blue-100">
            <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                <div className="flex h-[inherit] w-full border-l border-pzh-gray-200 pl-10">
                    <div className="flex w-full items-center justify-between border-l border-pzh-gray-200 pl-16">
                        <div className="flex items-center gap-4">
                            <PlusLight
                                size={20}
                                className="text-pzh-green-500"
                            />
                            <Heading
                                level="3"
                                size="s"
                                color="text-pzh-green-500"
                                className="-mb-1">
                                Nieuwe versie
                            </Heading>
                        </div>
                    </div>
                </div>
            </div>
        </Button>
    )
}

export default VersionAdd
