import {
    Button,
    FormikCheckbox,
    Heading,
    Modal,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'

import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'

interface ObjectDeleteModalProps {
    object?: ModelReturnType
    model: Model
    isOpen: boolean
    onClose: () => void
}

const ObjectDeleteModal = ({
    object,
    model,
    isOpen,
    onClose,
}: ObjectDeleteModalProps) => {
    const { objectId } = useParams()

    const {
        singularCapitalize,
        singularReadable,
        demonstrative,
        demonstrativeSingular,
    } = model.defaults
    const { useGetRelations } = model.fetchers

    const { data: relations } = useGetRelations(parseInt(objectId!), {
        query: {
            enabled: !!objectId,
        },
    })

    const handleDeletion = () => {}

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel={`${singularCapitalize} verwijderen`}
            maxWidth="sm:max-w-[1200px]"
            closeButton>
            <Heading level="2" className="mb-4">
                {singularCapitalize} verwijderen
            </Heading>

            <div className="prose prose-neutral mb-4 max-w-full leading-6 text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0">
                <Text>
                    Weet je zeker dat je {singularReadable}:{' '}
                    <span className="font-bold">{object?.Title}</span> wilt
                    verwijderen?
                </Text>

                {!!relations?.length && (
                    <>
                        <Text className="my-0 first-letter:capitalize">
                            {demonstrative}{' '}
                            {demonstrativeSingular || singularReadable} is
                            gekoppeld aan de volgende objecten:
                        </Text>

                        <ul className="mb-4 mt-0">
                            {relations.map(relation => {
                                const model =
                                    models[relation.Object_Type as ModelType]

                                return (
                                    <li
                                        key={
                                            relation.Object_Type +
                                            relation.Object_ID
                                        }>
                                        {model.defaults.singularCapitalize}:{' '}
                                        <span className="font-bold">
                                            {relation.Title}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )}

                <Text className="mt-0">
                    Deze verwijderactie kan niet ongedaan gemaakt worden.
                </Text>
            </div>

            <Formik
                onSubmit={handleDeletion}
                initialValues={{ consent: false }}>
                {({ dirty, isSubmitting }) => (
                    <Form>
                        <FormikCheckbox name="consent">
                            Ik weet zeker dat ik {demonstrative}{' '}
                            {demonstrativeSingular || singularReadable} wil
                            verwijderen
                        </FormikCheckbox>

                        <div className="mt-6 flex items-center justify-between border-t border-pzh-gray-300 pt-5">
                            <Button variant="link" onPress={onClose}>
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                variant="cta"
                                isDisabled={!dirty || isSubmitting}
                                isLoading={isSubmitting}>
                                {singularCapitalize} verwijderen
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectDeleteModal
