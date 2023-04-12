import { getHeadingStyles } from '@pzh-ui/components'
import classNames from 'classnames'
import DOMPurify from 'dompurify'

import { ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface ObjectContentProps {
    /** Object data */
    data: ModelReturnType
}

const ObjectContent = ({ data }: ObjectContentProps) => (
    <div>
        {htmlFields.map((field, index) => {
            const html = data[field.value]
            if (typeof html !== 'string') return null

            return (
                <Content
                    key={field.value}
                    index={index}
                    html={html}
                    {...field}
                />
            )
        })}
    </div>
)

interface ContentProps {
    index: number
    title?: string
    value: keyof ModelReturnType
    hidden?: boolean
    html: string
}

const Content = ({ index, title, value, hidden, html }: ContentProps) => {
    const cleanHtml = DOMPurify.sanitize(html)
    const { isMobile } = useBreakpoint()

    const Wrapper = value === 'Description' ? 'p' : 'div'

    return (
        <>
            <h2
                id={`object-section-${index}`}
                style={getHeadingStyles('3', isMobile)}
                className={classNames('mb-4', { 'sr-only': hidden })}>
                {title}
            </h2>
            <Wrapper
                className="prose prose-neutral prose-li:my-0 mb-4 md:mb-8 max-w-full text-pzh-blue-dark marker:text-pzh-blue-dark leading-6"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
        </>
    )
}

const htmlFields: {
    title?: string
    value: keyof ModelReturnType
    hidden?: boolean
}[] = [
    {
        title: 'Omschrijving',
        value: 'Description',
        hidden: true,
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
