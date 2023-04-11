import { getHeadingStyles } from '@pzh-ui/components'
import DOMPurify from 'dompurify'

import { ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface ObjectContentProps {
    /** Object data */
    data: ModelReturnType
}

const ObjectContent = ({ data }: ObjectContentProps) => (
    <div>
        {htmlFields.map(field => {
            const html = data[field.value]
            if (typeof html !== 'string') return null

            return <Content key={field.value} title={field.title} html={html} />
        })}
    </div>
)

interface ContentProps {
    title?: string
    html: string
}

const Content = ({ title, html }: ContentProps) => {
    const cleanHtml = DOMPurify.sanitize(html)
    const { isMobile } = useBreakpoint()

    return (
        <>
            {title && (
                <h2
                    id={`object-section-${title
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    style={getHeadingStyles('3', isMobile)}
                    className="mb-4">
                    {title}
                </h2>
            )}
            <div
                className="prose prose-neutral prose-li:my-0 mb-8 max-w-full text-pzh-blue-dark marker:text-pzh-blue-dark leading-6"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
        </>
    )
}

const htmlFields: { title?: string; value: keyof ModelReturnType }[] = [
    {
        title: undefined,
        value: 'Description',
    },
    {
        title: 'Wat wil de provincie bereiken?',
        value: 'Description_Choice',
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
        value: 'Description_Operation',
    },
]

export default ObjectContent
