import { Divider, Heading, Text, getHeadingStyles } from '@pzh-ui/components'
import htmlDiff from 'node-htmldiff'

import { LeafletRevisionOverview } from '@/components/Leaflet'
import { Model, ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import useRevisionStore from '@/store/revisionStore'

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
    const { isMobile } = useBreakpoint()

    const initialObject = useRevisionStore(state => state.initialObject)

    const { singularCapitalize, singularReadable } = model.defaults

    const titleDiff = htmlDiff(revisionFrom.Title || '', revisionTo.Title || '')

    return (
        <div>
            <Text type="body-bold" className="block">
                {singularCapitalize}
            </Text>

            <h2
                style={getHeadingStyles('2', isMobile)}
                className="mb-4 text-pzh-blue"
                dangerouslySetInnerHTML={{ __html: titleDiff }}
            />

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

            {(!!revisionFrom.Gebied || !!revisionTo.Gebied) && (
                <>
                    <Divider className="mb-6 mt-0" />

                    <Heading level="3" className="mb-2">
                        Werkingsgebied
                    </Heading>

                    <Text className="mb-3">
                        {revisionFrom.Gebied?.UUID === revisionTo.Gebied?.UUID
                            ? `Het gebied '${revisionFrom.Gebied?.Title}' in ${singularReadable} '${revisionFrom.Title}' is ongewijzigd.`
                            : `${singularCapitalize} '${revisionFrom.Title}' is gewijzigd van gebied '${revisionTo.Gebied?.Title}' naar gebied '${revisionFrom.Gebied?.Title}'`}
                    </Text>

                    <div className="h-[320px] overflow-hidden rounded-lg">
                        <LeafletRevisionOverview
                            id={`revision-map-${initialObject?.UUID}`}
                            area={{
                                type: 'Werkingsgebieden',
                                old: revisionFrom.Gebied?.UUID,
                                new: revisionTo.Gebied?.UUID,
                            }}
                        />
                    </div>
                    <div className="mt-3">
                        <span className="flex items-center">
                            <div className="-mt-1 mr-2 h-[14px] w-[14px] rounded-full bg-pzh-red" />{' '}
                            Verwijderd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="-mt-1 mr-2 h-[14px] w-[14px] rounded-full bg-pzh-green" />{' '}
                            Toegevoegd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="-mt-1 mr-2 h-[14px] w-[14px] rounded-full bg-pzh-blue-light" />{' '}
                            Ongewijzigd werkingsgebied
                        </span>
                    </div>
                </>
            )}
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
                className="prose prose-neutral mb-4 max-w-full whitespace-pre-line leading-6 text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0 md:mb-8"
                dangerouslySetInnerHTML={{ __html: diff }}
            />
        </>
    )
}

export default ObjectRevision
