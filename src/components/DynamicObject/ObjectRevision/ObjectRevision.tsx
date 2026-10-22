import { Divider, getHeadingStyles, Heading, Text } from '@pzh-ui/components'

import classNames from 'clsx'
import htmlDiff from 'node-htmldiff'
import { useParams } from 'react-router-dom'

import { LeafletRevisionOverview } from '@/components/Leaflet'
import { Model, ModelReturnType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
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
    const { moduleId } = useParams()
    const { user } = useAuth()

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
                    'mb-4 text-pzh-blue-500',
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

            {(!!revisionTo.Gebiedengroep_Static ||
                !!revisionFrom.Gebiedengroep_Static) &&
                ((!!!user && !moduleId) || !!user) && (
                    <>
                        <Divider className="mt-0 mb-6" />

                        <Heading level="3" size="m" className="mb-2">
                            Werkingsgebied
                        </Heading>

                        <Text className="mb-3">
                            {revisionTo.Gebiedengroep_Static?.Object_ID ===
                            revisionFrom.Gebiedengroep_Static?.Object_ID
                                ? `Het gebied '${revisionTo.Gebiedengroep_Static?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is ongewijzigd.`
                                : !!revisionTo.Gebiedengroep_Static
                                        ?.Object_ID &&
                                    !!revisionFrom.Gebiedengroep_Static
                                        ?.Object_ID
                                  ? `${singularCapitalize} '${revisionTo.Title}' is gewijzigd van gebied '${revisionTo.Werkingsgebied_Statics?.Cached_Title}' naar gebied '${revisionFrom.Werkingsgebied_Statics?.Cached_Title}'`
                                  : !!revisionTo.Gebiedengroep_Static?.Object_ID
                                    ? `Het gebied '${revisionTo.Gebiedengroep_Static?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is verwijderd.`
                                    : `Het gebied '${revisionFrom.Gebiedengroep_Static?.Cached_Title}' in ${singularReadable} '${revisionTo.Title}' is toegevoegd.`}
                        </Text>

                        <div className="h-[320px] overflow-hidden rounded-lg">
                            <LeafletRevisionOverview
                                id={`revision-map-${initialObject?.UUID}`}
                                area={{
                                    type: 'Gebiedengroep',
                                    old: revisionFrom.Gebiedengroep_Static
                                        ?.Object_ID,
                                    new: revisionTo.Gebiedengroep_Static
                                        ?.Object_ID,
                                }}
                            />
                        </div>
                        <div className="mt-3 space-y-1">
                            <span className="flex items-center">
                                <div className="border-pzh-red-500 mr-2 h-[14px] w-[14px] rounded-full border bg-[repeating-linear-gradient(-45deg,#D11F3D_0px,#D11F3D_2px,white_2px,white_4px)]" />
                                Verwijderde gebiedengroep
                            </span>

                            <span className="flex items-center">
                                <div className="border-pzh-green-500 mr-2 h-[14px] w-[14px] rounded-full border bg-[repeating-linear-gradient(45deg,#00804D_0px,#00804D_2px,white_2px,white_4px)]" />
                                Toegevoegde gebiedengroep
                            </span>

                            <span className="flex items-center">
                                <div className="border-pzh-blue-500 mr-2 h-[14px] w-[14px] rounded-full border bg-[repeating-linear-gradient(0deg,#281F6B_0px,#281F6B_2px,white_2px,white_4px)]" />
                                Ongewijzigde gebiedengroep
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
            <Heading
                level="3"
                size="s"
                className="mb-2"
                color="text-pzh-blue-900">
                {customTitle?.[value] || title}
            </Heading>
            <div
                className="prose mb-4 max-w-full text-m whitespace-pre-line text-pzh-blue-900 prose-neutral md:mb-8 prose-li:my-0"
                dangerouslySetInnerHTML={{ __html: finalDiff }}
            />
        </>
    )
}

export default ObjectRevision
