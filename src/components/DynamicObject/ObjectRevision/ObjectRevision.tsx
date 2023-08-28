import { Divider, Heading, Text, getHeadingStyles } from '@pzh-ui/components'
import htmlDiff from 'node-htmldiff'

import { LeafletRevisionOverview } from '@/components/Leaflet'
import { Model, ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import useRevisionStore from '@/store/revisionStore'

import { fields } from '../ObjectContent/ObjectContent'
import { useMemo } from 'react'

interface ObjectRevisionProps {
    model: Model
    revisionFrom: ModelReturnType
    revisionTo: ModelReturnType
    latestUUID?: string
}

const ObjectRevision = ({
    model,
    revisionFrom,
    revisionTo,
    latestUUID,
}: ObjectRevisionProps) => {
    const { isMobile } = useBreakpoint()

    const initialObject = useRevisionStore(state => state.initialObject)

    const { compareA, compareB } = useMemo(() => {
        if (!latestUUID)
            return {
                compareA: revisionTo,
                compareB: revisionFrom,
            }

        if (revisionFrom.UUID === latestUUID) {
            return {
                compareA: revisionTo,
                compareB: revisionFrom,
            }
        }

        return {
            compareA: revisionFrom,
            compareB: revisionTo,
        }
    }, [revisionFrom, revisionTo])

    const { singularCapitalize, singularReadable } = model.defaults

    const titleDiff = htmlDiff(compareA.Title || '', compareB.Title || '')

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
                const contentFrom = compareA[field.value]
                const contentTo = compareB[field.value]

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

            {(!!compareA.Gebied || !!compareB.Gebied) && (
                <>
                    <Divider className="mb-6 mt-0" />

                    <Heading level="3" className="mb-2">
                        Werkingsgebied
                    </Heading>

                    <Text className="mb-3">
                        {compareA.Gebied?.UUID === compareB.Gebied?.UUID
                            ? `Het gebied '${compareA.Gebied?.Title}' in ${singularReadable} '${compareA.Title}' is ongewijzigd.`
                            : !!compareA.Gebied?.UUID && !!compareB.Gebied?.UUID
                            ? `${singularCapitalize} '${compareA.Title}' is gewijzigd van gebied '${compareA.Gebied?.Title}' naar gebied '${compareB.Gebied?.Title}'`
                            : !!compareA.Gebied?.UUID
                            ? `Het gebied '${compareA.Gebied?.Title}' in ${singularReadable} '${compareA.Title}' is verwijderd.`
                            : `Het gebied '${compareB.Gebied?.Title}' in ${singularReadable} '${compareA.Title}' is toegevoegd.`}
                    </Text>

                    <div className="h-[320px] overflow-hidden rounded-lg">
                        <LeafletRevisionOverview
                            id={`revision-map-${initialObject?.UUID}`}
                            area={{
                                type: 'Werkingsgebieden',
                                old: compareB.Gebied?.UUID,
                                new: compareA.Gebied?.UUID,
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
