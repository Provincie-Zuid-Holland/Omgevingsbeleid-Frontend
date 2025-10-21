import { Divider, Heading, Text, getHeadingStyles } from '@pzh-ui/components'
import classNames from 'clsx'
import htmlDiff from 'node-htmldiff'

import { LeafletRevisionOverview } from '@/components/Leaflet'
import { Model, ModelReturnType } from '@/config/objects/types'
import useRevisionStore from '@/store/revisionStore'

import {
    replaceImagesWithTokens,
    restoreImagesWithDiff,
} from '@/utils/normalizeImages'
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
    const initialObject = useRevisionStore(state => state.initialObject)

    const { singularCapitalize, singularReadable, singular } = model.defaults

    const titleDiff = htmlDiff(revisionTo.Title || '', revisionFrom.Title || '')

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
                const contentFrom = revisionTo[field.value]
                const contentTo = revisionFrom[field.value]

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

            {(!!revisionTo.Werkingsgebied_Statics ||
                !!revisionFrom.Werkingsgebied_Statics) && (
                <>
                    <Divider className="mt-0 mb-6" />

                    <Heading level="3" size="m" className="mb-2">
                        Werkingsgebied
                    </Heading>

                    <Text className="mb-3">
                        {revisionTo.Werkingsgebied_Statics?.Object_ID ===
                        revisionFrom.Werkingsgebied_Statics?.Object_ID
                            ? `Het gebied '${revisionTo.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is ongewijzigd.`
                            : !!revisionTo.Werkingsgebied_Statics?.Object_ID &&
                                !!revisionFrom.Werkingsgebied_Statics?.Object_ID
                              ? `${singularCapitalize} '${revisionTo.Title}' is gewijzigd van gebied '${revisionTo.Werkingsgebied_Statics?.Cached_Title}' naar gebied '${revisionFrom.Werkingsgebied_Statics?.Cached_Title}'`
                              : !!revisionTo.Werkingsgebied_Statics?.Object_ID
                                ? `Het gebied '${revisionTo.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is verwijderd.`
                                : `Het gebied '${revisionFrom.Werkingsgebied_Statics?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is toegevoegd.`}
                    </Text>

                    <div className="h-[320px] overflow-hidden rounded-lg">
                        <LeafletRevisionOverview
                            id={`revision-map-${initialObject?.UUID}`}
                            area={{
                                type: 'Werkingsgebieden',
                                old: revisionFrom.Werkingsgebied_Statics
                                    ?.Object_ID,
                                new: revisionTo.Werkingsgebied_Statics
                                    ?.Object_ID,
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
    const storeA: Record<string, string> = {}
    const storeB: Record<string, string> = {}

    const cleanA = replaceImagesWithTokens(htmlFrom, storeA)
    const cleanB = replaceImagesWithTokens(htmlTo, storeB)

    const diff = htmlDiff(cleanA, cleanB)

    const finalDiff = restoreImagesWithDiff(diff, storeA, storeB)

    return (
        <>
            <Text bold className="mb-2">
                {customTitle?.[value] || title}
            </Text>
            <div
                className="prose prose-neutral text-m text-pzh-blue-900 prose-li:my-0 mb-4 max-w-full whitespace-pre-line md:mb-8"
                dangerouslySetInnerHTML={{ __html: finalDiff }}
            />
        </>
    )
}

export default ObjectRevision
