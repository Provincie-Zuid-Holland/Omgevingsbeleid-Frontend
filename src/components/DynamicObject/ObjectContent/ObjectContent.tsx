import { Button, Heading, Text, Tooltip } from '@pzh-ui/components'
import classNames from 'clsx'
import DOMPurify from 'dompurify'
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser'
import { useParams } from 'react-router-dom'

import {
    ReadRelationShortNationaalBelangMinimal,
    ReadRelationShortWettelijkeTaakMinimal,
} from '@/api/fetchers.schemas'
import ObjectAreaModal from '@/components/Modals/ObjectModals/ObjectAreaModal'
import { ModelReturnType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'

interface ObjectContentProps {
    /** Object data */
    data: ModelReturnType
    /** Custom description title */
    customTitle?: {
        [K in keyof ModelReturnType]: string
    }
}

const ObjectContent = ({ data, customTitle }: ObjectContentProps) => (
    <div data-section="Inhoud">
        {fields.map(field => {
            const content = data[field.value]

            if (field.list && Array.isArray(content) && !!content.length) {
                return (
                    <List
                        key={field.value}
                        items={
                            content as (
                                | ReadRelationShortNationaalBelangMinimal
                                | ReadRelationShortWettelijkeTaakMinimal
                            )[]
                        }
                        {...field}
                    />
                )
            }

            if (typeof content !== 'string') return null

            return (
                <Content
                    key={field.value}
                    html={content}
                    customTitle={customTitle}
                    {...field}
                />
            )
        })}
    </div>
)

interface ContentProps {
    title?: string
    value: keyof ModelReturnType
    hidden?: boolean
    html: string
    customTitle?: {
        [K in keyof ModelReturnType]: string
    }
}

const Content = ({ title, value, hidden, html, customTitle }: ContentProps) => {
    const { moduleId } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    let cleanHtml = DOMPurify.sanitize(html)

    if (value === 'Weblink') {
        cleanHtml = cleanHtml.replace(
            /\bhttps?:\/\/\S+/gi,
            '<a class="underline text-pzh-green-500 hover:text-pzh-blue-900" href="$&" target="_blank" rel="noreferrer noopener">$&</a>'
        )
    }

    const options: HTMLReactParserOptions = {
        replace: domNode => {
            if (domNode.type === 'tag' && domNode.name === 'a') {
                const element = domNode as any
                const label = element.attribs['data-gebiedengroep-label']

                if (label) {
                    return (
                        <Tooltip
                            label={
                                <Text
                                    as="span"
                                    size="s"
                                    color="text-pzh-white"
                                    className="block">
                                    Gebiedsaanwijzing:
                                    <strong className="ml-1 font-bold text-pzh-white">
                                        {label}
                                    </strong>
                                </Text>
                            }>
                            <Button
                                key={label}
                                variant="default"
                                className="text-pzh-red-900 underline hover:text-pzh-blue-900"
                                onPress={() =>
                                    setActiveModal('objectArea', {
                                        moduleId,
                                        label,
                                        id: element.attribs[
                                            'data-gebiedengroep-id'
                                        ],
                                        locatie:
                                            element.attribs[
                                                'data-hint-locatie'
                                            ],
                                        gebiedsaanwijzingtype:
                                            element.attribs[
                                                'data-hint-gebiedsaanwijzingtype'
                                            ],
                                        gebiedengroep:
                                            element.attribs[
                                                'data-hint-gebiedengroep'
                                            ],
                                    })
                                }
                                {...element.attribs}>
                                {domToReact(element.children, options)}
                            </Button>
                        </Tooltip>
                    )
                }
            }
            return undefined // Return undefined for other elements to be parsed as usual
        },
    }

    const parsedContent = parse(cleanHtml, options)

    const Wrapper = value === 'Description' ? 'p' : 'div'

    return (
        <>
            {title && (
                <Heading
                    level="2"
                    size="m"
                    className={classNames('mb-4', {
                        'sr-only': hidden && !customTitle?.[value],
                    })}>
                    {customTitle?.[value] || title}
                </Heading>
            )}
            <Wrapper className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 md:mb-8">
                {parsedContent}
            </Wrapper>
            <ObjectAreaModal />
        </>
    )
}

interface ListProps {
    title?: string
    description?: string
    hidden?: boolean
    items: (
        | ReadRelationShortNationaalBelangMinimal
        | ReadRelationShortWettelijkeTaakMinimal
    )[]
}

const List = ({ title, description, items, hidden }: ListProps) => (
    <div
        data-section={title}
        className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 md:mb-8">
        <Heading
            level="2"
            className={classNames('mb-4', { 'sr-only': hidden })}>
            {title}
        </Heading>
        {description && <p>{description}</p>}
        <Heading level="3" size="m" className="my-4">
            Gekoppelde ‘{title}’
        </Heading>
        <ul>
            {items.map(item => (
                <li key={item.Object.UUID}>
                    {'Weblink' in item.Object && item.Object?.Weblink ? (
                        <a
                            href={item.Object.Weblink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pzh-green-500 hover:text-pzh-green-900">
                            {item.Object.Title}
                        </a>
                    ) : (
                        <span>{item.Object.Title}</span>
                    )}
                </li>
            ))}
        </ul>
    </div>
)

export const fields: {
    title?: string
    description?: string
    value: keyof ModelReturnType
    hidden?: boolean
    list?: boolean
}[] = [
    {
        title: 'Omschrijving',
        value: 'Description',
        hidden: true,
    },
    {
        title: 'Rol',
        value: 'Role',
    },
    {
        title: 'Nadere uitwerking',
        value: 'Effect',
    },
    {
        value: 'Weblink',
        hidden: true,
    },
    {
        title: 'Aanleiding',
        value: 'Cause',
    },
    {
        title: 'Provinciaal Belang',
        value: 'Provincial_Interest',
    },
    {
        title: 'Nadere uitwerking',
        value: 'Explanation',
    },
    {
        title: 'Wettelijke taken',
        value: 'WettelijkeTaken',
        description:
            'Wettelijke taken zijn taken die de provincie uitvoert in medebewind, dit zijn taken die door de rijksoverheid wettelijk zijn opgelegd.',
        list: true,
    },
    {
        title: 'Nationale belangen',
        value: 'NationaleBelangen',
        description:
            'Nationale belangen zijn de inhoudelijke belangen bij de fysieke leefomgeving waarbij het Rijk een rol voor zichzelf ziet en waarvoor het Kabinet in politieke zin aanspreekbaar is. De behartiging van de nationale belangen zijn gedeeld. Dat betekent dat het Rijk moet afstemmen met gemeenten, waterschappen en provincies en andere belanghebbenden. Voor de nationale belangen in de provinciale Omgevingsvisie is bepaald dat de provincie deze met haar uitvoeringsinstrumenten het meest doelmatig en doeltreffend kan realiseren.',
        list: true,
    },
]

export default ObjectContent
