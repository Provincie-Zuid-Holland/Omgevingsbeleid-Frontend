import { Heading, Text } from '@pzh-ui/components'
import htmlDiff from 'node-htmldiff'

import { Model, ModelReturnType } from '@/config/objects/types'

import { fields } from '../ObjectContent/ObjectContent'

interface ObjectRevisionProps {
    model: Model
    revisionFrom: ModelReturnType
    revisionTo: ModelReturnType
}

const ObjectRevision = ({
    model,
    revisionFrom,
    revisionTo,
}: ObjectRevisionProps) => {
    const { singularCapitalize } = model.defaults

    const titleDiff = htmlDiff(revisionFrom.Title || '', revisionTo.Title || '')

    return (
        <div>
            <Text type="body-bold" className="block">
                {singularCapitalize}
            </Text>

            <Heading level="2" className="mb-4">
                {titleDiff}
            </Heading>

            {fields.map(field => {
                const contentTo = revisionFrom[field.value]
                const contentFrom = revisionTo[field.value]

                if (
                    (typeof contentFrom !== 'string' && contentFrom !== null) ||
                    (typeof contentTo !== 'string' && contentTo !== null)
                )
                    return null

                return (
                    <Content
                        key={field.value}
                        htmlFrom={contentFrom || ''}
                        htmlTo={contentTo || ''}
                        {...field}
                    />
                )
            })}
        </div>
    )
}

interface ContentProps {
    title?: string
    htmlFrom: string
    htmlTo: string
}

const Content = ({ title, htmlFrom, htmlTo }: ContentProps) => {
    const diff = htmlDiff(htmlFrom, htmlTo)

    return (
        <>
            <Text type="body-bold" className="mb-2">
                {title}
            </Text>
            <p
                className="prose prose-neutral prose-li:my-0 mb-4 md:mb-8 max-w-full text-pzh-blue-dark marker:text-pzh-blue-dark leading-6"
                dangerouslySetInnerHTML={{ __html: diff }}
            />
        </>
    )
}

export default ObjectRevision
