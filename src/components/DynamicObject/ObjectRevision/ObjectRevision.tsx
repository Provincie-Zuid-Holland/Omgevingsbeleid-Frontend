import { Divider, Heading, Text, getHeadingStyles } from '@pzh-ui/components'
import classNames from 'classnames'
import htmlDiff from 'node-htmldiff'
import { useMemo } from 'react'

import { LeafletRevisionOverview } from '@/components/Leaflet'
import { Model, ModelReturnType } from '@/config/objects/types'
import useRevisionStore from '@/store/revisionStore'

import { fields } from '../ObjectContent/ObjectContent'

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
    }, [revisionFrom, revisionTo, latestUUID])

    const { singularCapitalize, singularReadable, singular } = model.defaults

    const titleDiff = htmlDiff(compareA.Title || '', compareB.Title || '')

    return (
        <div>
            <Text bold className="block">
                {singularCapitalize}
            </Text>

            <h2
                className={classNames(
                    'mb-4 text-pzh-blue',
                    getHeadingStyles('l')
                )}
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
                        customTitle={
                            singular === 'beleidskeuze' ||
                            singular === 'maatregel'
                                ? {
                                      Description:
                                          'Wat wil de provincie bereiken?',
                                  }
                                : undefined
                        }
                        {...field}
                    />
                )
            })}

            {(!!compareA.Gebied || !!compareB.Gebied) && (
                <>
                    <Divider className="mb-6 mt-0" />

                    <Heading level="3" size="m" className="mb-2">
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
                            <div className="size-[14px] -mt-1 mr-2 rounded-full bg-pzh-red" />{' '}
                            Verwijderd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="size-[14px] -mt-1 mr-2 rounded-full bg-pzh-green" />{' '}
                            Toegevoegd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="size-[14px] -mt-1 mr-2 rounded-full bg-pzh-blue-light" />{' '}
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
    /** Custom description title */
    customTitle?: {
        [K in keyof ModelReturnType]: string
    }
    htmlFrom: string
    htmlTo: string
    value: keyof ModelReturnType
}

const Content = ({
    title,
    customTitle,
    value,
    htmlFrom,
    htmlTo,
}: ContentProps) => {
    const diff = htmlDiff(htmlFrom, htmlTo)

    return (
        <>
            <Text bold className="mb-2">
                {customTitle?.[value] || title}
            </Text>
            <p
                className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0 md:mb-8"
                dangerouslySetInnerHTML={{ __html: diff }}
            />
        </>
    )
}

export default ObjectRevision
