import { Text, formatDate } from '@pzh-ui/components'
import { ClockRotateLeft } from '@pzh-ui/icons'
import { useMemo } from 'react'

interface ObjectDetailsProps {
    /** Start date of validity */
    date?: Date
    /** Amount of revisions */
    revisions?: number
}

const ObjectDetails = ({ date, revisions }: ObjectDetailsProps) => {
    const formattedDate = useMemo(
        () => date && formatDate(date, 'd MMMM yyyy'),
        [date]
    )

    return (
        <div className="flex justify-between mb-3 md:mb-0 md:mt-3 xl:mt-0 xl:block">
            {date && (
                <div className="xl:mt-4">
                    <Text type="body-bold" className="hidden xl:block">
                        Status
                    </Text>
                    <Text type="span" className="block">
                        Vigerend <br className="hidden xl:block" />
                        sinds {formattedDate}
                    </Text>
                </div>
            )}

            {!!revisions && revisions > 0 && (
                <div className="xl:mt-4">
                    <Text type="body-bold" className="hidden xl:block">
                        Revisies
                    </Text>
                    <button className="flex xl:block items-center text-pzh-green underline">
                        <ClockRotateLeft
                            size={16}
                            className="text-pzh-blue-dark mr-2 -mt-1 block xl:hidden"
                        />
                        {revisions} {revisions === 1 ? 'revisie' : 'revisies'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ObjectDetails
