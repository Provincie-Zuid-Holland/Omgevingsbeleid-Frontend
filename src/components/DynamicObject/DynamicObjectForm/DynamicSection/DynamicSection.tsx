import { Divider, getHeadingStyles, Text } from '@pzh-ui/components'

import { DynamicSection as DynamicSectionProps } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

import DynamicField from '../DynamicField'

const DynamicSection = ({
    title,
    description,
    fields,
    isLast,
}: DynamicSectionProps & { isLast?: boolean }) => {
    const { isMobile } = useBreakpoint()

    return (
        <>
            <div className="col-span-2">
                <h2
                    style={getHeadingStyles('3', isMobile)}
                    className="mb-3 text-pzh-blue">
                    {title}
                </h2>
                {description && <Text type="body">{description}</Text>}
            </div>

            <div className="col-span-4 pt-[48px]">
                {fields.map((field, index) => (
                    <DynamicField
                        key={`field-${field.type}-${index}`}
                        isFirst={index === 0}
                        {...field}
                    />
                ))}
            </div>

            {!isLast && (
                <div className="col-span-6">
                    <Divider className="my-8" />
                </div>
            )}
        </>
    )
}

export default DynamicSection
