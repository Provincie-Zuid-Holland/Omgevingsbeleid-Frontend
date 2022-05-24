import { Badge } from '@pzh-ui/components'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'

import { MaatregelenRead, BeleidskeuzesRead } from '@/api/fetchers.schemas'
import ColoredBall from '@/components/ColoredBall'
import LineIndicatorLeftToRight from '@/components/LineIndicatorLeftToRight'

export type CheckedOutPolicyContainerProps = {
    originalLineage: null | (MaatregelenRead | BeleidskeuzesRead)[]
    checkedOutPolicy: MaatregelenRead | BeleidskeuzesRead
}

/**
 * Contains a policy card and optionally a timeline when
 * the type is that of "checked out" or "archived".
 */
const CheckedOutPolicyContainer: FC<CheckedOutPolicyContainerProps> = ({
    originalLineage,
    checkedOutPolicy,
    children,
}) => {
    const getStatussesBetweenCheckedOutAndPreviousValid = () => {
        if (!originalLineage) return []

        const checkedOutPolicyIndex = originalLineage.findIndex(
            policy => policy.UUID === checkedOutPolicy.UUID
        )

        // remove everything before the checked out policy
        const filteredLineage = originalLineage.slice(checkedOutPolicyIndex + 1)

        const nextValidPolicyIndex = filteredLineage.findIndex(
            policy =>
                policy.Status === 'Vigerend' && policy.Aanpassing_Op === null
        )

        // remove everything after the next valid policy
        const filteredLineageAfterNextValidPolicy = filteredLineage.slice(
            0,
            nextValidPolicyIndex
        )

        // remove every policy in filteredLineageAfterNextValidPolicy that has a value on Aanpassing_Op
        const filteredLineageAfterNextValidPolicyWithoutAanpassing_Op =
            filteredLineageAfterNextValidPolicy.filter(
                policy => policy.Aanpassing_Op === null
            )

        const statusses =
            filteredLineageAfterNextValidPolicyWithoutAanpassing_Op
                .map(policy => policy.Status)
                .filter(
                    (policy, index) =>
                        filteredLineageAfterNextValidPolicyWithoutAanpassing_Op[
                            index - 1
                        ]?.Status !== policy
                )

        return statusses
    }

    const statusses = getStatussesBetweenCheckedOutAndPreviousValid()

    return (
        <div>
            <div>{children}</div>
            <div className="pl-6 -mt-4">
                <div className="border-l-2 border-pzh-green-light">
                    <div className="py-6 pl-6 ml-6 border-l-2 border-pzh-red-light">
                        {statusses.map((status, index) => (
                            <div
                                key={`${status}-${statusses.length - index}`}
                                className={classNames(
                                    'relative flex items-center',
                                    {
                                        'mt-3': index > 0,
                                    }
                                )}>
                                <ColoredBall
                                    color="red"
                                    className="-left-6"
                                    style={{ marginLeft: '-8px' }}
                                />
                                <motion.div
                                    initial={{ right: -10 }}
                                    animate={{ right: 0 }}
                                    className="relative">
                                    <Badge
                                        variant="lightRed"
                                        upperCase={false}
                                        text={status || ''}
                                    />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                    <LineIndicatorLeftToRight />
                </div>
            </div>
        </div>
    )
}

export default CheckedOutPolicyContainer
