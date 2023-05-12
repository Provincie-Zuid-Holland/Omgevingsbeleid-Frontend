import { Heading, getHeadingStyles } from '@pzh-ui/components'
import classNames from 'classnames'
import DOMPurify from 'dompurify'

import { RelationShortWettelijkeTaakShort } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface ObjectContentProps {
    /** Object data */
    data: ModelReturnType
}

const ObjectContent = ({ data }: ObjectContentProps) => (
    <div data-section="Inhoud">
        {fields.map(field => {
            const content = data[field.value]

            if (field.list && Array.isArray(content) && !!content.length) {
                return <List key={field.value} items={content} {...field} />
            }

            if (typeof content !== 'string') return null

            return <Content key={field.value} html={content} {...field} />
        })}
    </div>
)

interface ContentProps {
    title?: string
    value: keyof ModelReturnType
    hidden?: boolean
    html: string
}

const Content = ({ title, value, hidden, html }: ContentProps) => {
    const cleanHtml = DOMPurify.sanitize(html)
    const { isMobile } = useBreakpoint()

    const Wrapper = value === 'Description' ? 'p' : 'div'

    return (
        <>
            <h2
                style={getHeadingStyles('3', isMobile)}
                className={classNames('mb-4 text-pzh-blue', {
                    'sr-only': hidden,
                })}>
                {title}
            </h2>
            <Wrapper
                className="prose prose-neutral prose-li:my-0 mb-4 md:mb-8 max-w-full text-pzh-blue-dark marker:text-pzh-blue-dark leading-6"
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
        | RelationShortWettelijkeTaakShort
        | RelationShortWettelijkeTaakShort
    )[]
}

const List = ({ title, description, items, hidden }: ListProps) => {
    return (
        <div
            data-section={title}
            className="mb-4 md:mb-8 max-w-full whitespace-pre-line prose prose-neutral prose-li:my-0 text-pzh-blue-dark marker:text-pzh-blue-dark leading-6">
            <Heading
                level="2"
                className={classNames('mb-4', { 'sr-only': hidden })}>
                {title}
            </Heading>
            {description && <p>{description}</p>}
            <Heading level="3" className="my-4">
                Gekoppelde ‘{title}’
            </Heading>
            <ul>
                {items.map(item => (
                    <li key={item.Object.UUID}>
                        {item.Object.Weblink ? (
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
}

const fields: {
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
        title: 'Wat wil de provincie bereiken?',
        value: 'Accomplish',
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
        title: 'Toelichting',
        value: 'Explanation',
    },
    {
        title: 'Wettelijke taken',
        value: 'WettelijkeTaken',
        description:
            'ChatGPT: Een provincie is een bestuurlijke eenheid binnen een land en heeft specifieke taken en bevoegdheden die zijn vastgelegd in de wet. Taken van een provincie omvatten onder meer het beheren en onderhouden van provinciale wegen en waterwegen, het bevorderen van economische ontwikkeling, het verstrekken van subsidies aan culturele instellingen en het handhaven van de openbare orde en veiligheid.\n\nDe bevoegdheden van een provincie omvatten onder meer het vaststellen van verordeningen en het nemen van besluiten over ruimtelijke ordening, milieu, natuur en recreatie. Daarnaast heeft de provincie de bevoegdheid om toezicht te houden op gemeenten en om in te grijpen wanneer gemeenten hun taken niet naar behoren uitvoeren. Ook heeft de provincie een adviserende rol bij rijksbesluiten die gevolgen hebben voor de provincie.',
        list: true,
    },
    {
        title: 'Nationale belangen',
        value: 'NationaleBelangen',
        description:
            "ChatGPT: Een 'nationaal belang' voor de provincie Zuid-Holland kan bijvoorbeeld de veiligheid en bescherming tegen overstromingen zijn, gezien de provincie zich grotendeels onder zeeniveau bevindt. Ook kan de bereikbaarheid van de haven van Rotterdam als belangrijke economische motor van het land als nationaal belang worden beschouwd. Daarnaast kunnen zaken als duurzame energievoorziening, behoud van het cultureel erfgoed en het stimuleren van innovatie en ondernemerschap in de regio als nationale belangen worden beschouwd.",
        list: true,
    },
]

export default ObjectContent
