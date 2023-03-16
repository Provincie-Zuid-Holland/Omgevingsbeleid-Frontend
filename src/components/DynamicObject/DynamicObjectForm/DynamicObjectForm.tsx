import { Divider } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'

import { LoaderContent } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import { toastNotification } from '@/utils/toastNotification'

import SectionBasicInfo from './Sections/SectionBasicInfo'
import SectionConnections from './Sections/SectionConnections'
import SectionDescription from './Sections/SectionDescription'

interface DynamicObjectFormProps {
    model: Model
}

const DynamicObjectForm = ({ model }: DynamicObjectFormProps) => {
    const queryClient = useQueryClient()

    const { moduleId, objectId } = useParams()

    const sections = model.dynamicSections
    const { useGetLatestObjectInModule, usePatchObjectInModule } =
        model.fetchers
    const { getLatestObjectInModuleQueryKey } = model.queryKeys

    const { data, isLoading } = useGetLatestObjectInModule(
        parseInt(moduleId!),
        parseInt(objectId!),
        {
            query: {
                enabled: !!moduleId && !!objectId,
            },
        }
    )

    const patchObject = usePatchObjectInModule({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient.invalidateQueries(
                    getLatestObjectInModuleQueryKey(
                        parseInt(moduleId!),
                        parseInt(objectId!)
                    )
                )

                toastNotification({ type: 'saved' })
            },
        },
    })

    const handleSubmit = () => {}

    if (isLoading) return <LoaderContent />

    return (
        <div>
            <Formik
                initialValues={data || {}}
                onSubmit={handleSubmit}
                enableReinitialize>
                <Form>
                    <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                        <SectionBasicInfo model={model} />
                        <div className="col-span-6">
                            <Divider className="my-8" />
                        </div>
                        {sections?.map((section, index) => {
                            switch (section.type) {
                                case 'description':
                                    return (
                                        <SectionWrapper
                                            key={`section-${index}`}
                                            isLast={
                                                index + 1 === sections.length
                                            }>
                                            <SectionDescription
                                                model={model}
                                                section={section}
                                            />
                                        </SectionWrapper>
                                    )
                                case 'connections':
                                    return (
                                        <SectionWrapper
                                            key={`section-${index}`}
                                            isLast={
                                                index + 1 === sections.length
                                            }>
                                            <SectionConnections
                                                model={model}
                                                section={section}
                                            />
                                        </SectionWrapper>
                                    )
                                default:
                                    break
                            }
                        })}
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

interface SectionWrapperProps {
    isLast: boolean
    children: JSX.Element
}

const SectionWrapper = ({ children, isLast }: SectionWrapperProps) => (
    <>
        {children}
        {!isLast && (
            <div className="col-span-6">
                <Divider className="my-8" />
            </div>
        )}
    </>
)

export default DynamicObjectForm
