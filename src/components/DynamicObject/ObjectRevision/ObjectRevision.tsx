import { Divider, Heading, Text, getHeadingStyles } from '@pzh-ui/components'
import classNames from 'clsx'
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
                    'text-pzh-blue-500 mb-4',
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
                            singular === 'beleidskeuze'
                                ? {
                                      Description:
                                          'Wat wil de provincie bereiken?',
                                  }
                                : singular === 'maatregel'
                                  ? {
                                        Description:
                                            'Wat gaat de provincie doen?',
                                    }
                                  : undefined
                        }
                        {...field}
                    />
                )
            })}

            {(!!compareA.Werkingsgebied_Statics ||
                !!compareB.Werkingsgebied_Statics) && (
                <>
                    <Divider className="mt-0 mb-6" />

                    <Heading level="3" size="m" className="mb-2">
                        Werkingsgebied
                    </Heading>

                    <Text className="mb-3">
                        {compareA.Werkingsgebied_Statics?.Object_ID ===
                        compareB.Werkingsgebied_Statics?.Object_ID
                            ? `Het gebied '${compareA.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${compareA.Title}' is ongewijzigd.`
                            : !!compareA.Werkingsgebied_Statics?.Object_ID &&
                                !!compareB.Werkingsgebied_Statics?.Object_ID
                              ? `${singularCapitalize} '${compareA.Title}' is gewijzigd van gebied '${compareA.Werkingsgebied_Statics?.Cached_Title}' naar gebied '${compareB.Werkingsgebied_Statics?.Cached_Title}'`
                              : !!compareA.Werkingsgebied_Statics?.Object_ID
                                ? `Het gebied '${compareA.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${compareA.Title}' is verwijderd.`
                                : `Het gebied '${compareB.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${compareA.Title}' is toegevoegd.`}
                    </Text>

                    <div className="h-[320px] overflow-hidden rounded-lg">
                        <LeafletRevisionOverview
                            id={`revision-map-${initialObject?.UUID}`}
                            area={{
                                type: 'Werkingsgebieden',
                                old: compareB.Werkingsgebied_Statics?.Object_ID,
                                new: compareA.Werkingsgebied_Statics?.Object_ID,
                            }}
                        />
                    </div>
                    <div className="mt-3">
                        <span className="flex items-center">
                            <div className="bg-pzh-red-500 -mt-1 mr-2 h-[14px] w-[14px] rounded-full" />{' '}
                            Verwijderd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="bg-pzh-green-500 -mt-1 mr-2 h-[14px] w-[14px] rounded-full" />{' '}
                            Toegevoegd werkingsgebied
                        </span>
                        <span className="flex items-center">
                            <div className="bg-pzh-blue-100 -mt-1 mr-2 h-[14px] w-[14px] rounded-full" />{' '}
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
                className="prose prose-neutral text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 mb-4 max-w-full whitespace-pre-line md:mb-8"
                dangerouslySetInnerHTML={{ __html: diff }}
            />
        </>
    )
}

export default ObjectRevision
