import { Heading } from '@pzh-ui/components'
import classNames from 'clsx'
import DOMPurify from 'dompurify'

import {
    ReadRelationShortNationaalBelangMinimal,
    ReadRelationShortWettelijkeTaakMinimal,
} from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'

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
    let cleanHtml = DOMPurify.sanitize(html)

    if (value === 'Weblink') {
        cleanHtml = cleanHtml.replace(
            /\bhttps?:\/\/\S+/gi,
            '<a class="underline text-pzh-green hover:text-pzh-blue-dark" href="$&" target="_blank" rel="noreferrer noopener">$&</a>'
        )
    }

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
            <Wrapper
                className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0 md:mb-8"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
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
        className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0 md:mb-8">
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
                            className="text-pzh-green hover:text-pzh-green-dark">
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
        title: 'Rolkeuze',
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
