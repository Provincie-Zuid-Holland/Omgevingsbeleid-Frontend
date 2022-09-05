import { Heading, Card, Text, Badge, Hyperlink } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, EllipsisVertical } from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { MaatregelenRead, BeleidskeuzesRead } from '@/api/fetchers.schemas'
import ColoredBall from '@/components/ColoredBall'
import Dropdown from '@/components/Dropdown'
import {
    PopUpAddPolicyToModule,
    PopUpChangePolicyStatus,
} from '@/components/Popup'
import allDimensies from '@/constants/dimensies'
import { removePolicyFromModule } from '@/utils/removePolicyFromModule'

type PossibleCardTypes = 'checked out' | 'archived' | 'valid'

export type PolicyDetailCardProps = {
    dimensieConstants:
        | typeof allDimensies.BELEIDSKEUZES
        | typeof allDimensies.MAATREGELEN
    policy: MaatregelenRead | BeleidskeuzesRead
    type: PossibleCardTypes
    lastItem?: boolean
}

const PolicyDetailCard = ({
    dimensieConstants,
    policy,
    type,
    lastItem,
}: PolicyDetailCardProps) => {
    const queryClient = useQueryClient()

    const [dropdown, setDropdown] = useState(false)
    const [statusPopup, setStatusPopup] = useState(false)
    const [modulesPopup, setModulesPopup] = useState(false)

    const overviewSlug = dimensieConstants.SLUG_OVERVIEW
    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const linkToRaadpleegPage = `/${overviewSlug}/${policy.UUID}`
    const linkToEditWithoutCheckingOutNewVersion = `/muteer/${overviewSlug}/${policy.ID}/bewerk?modus=wijzig_vigerend`
    const policyIsInAModule = policy?.Ref_Beleidsmodules?.length !== 0

    const dropdownItems = [
        // Conditionally add dropdown item to change the status of a policy
        // A user can only change the status of non-valid policies
        ...(policy.Status !== 'Vigerend'
            ? [
                  {
                      text: 'Status aanpassen',
                      callback: () => {
                          setStatusPopup(true)
                      },
                  },
              ]
            : []),
        {
            text: 'Raadpleegomgeving',
            link: linkToRaadpleegPage,
        },
        {
            text: policyIsInAModule
                ? 'Verwijderen uit module'
                : 'Toevoegen aan module',
            callback: policyIsInAModule
                ? () =>
                      removePolicyFromModule(policy, titleSingular, queryClient)
                : () => setModulesPopup(true),
        },
        ...(policy.Status === 'Vigerend'
            ? [
                  {
                      text: 'Wijzigen zonder besluitvormingsproces',
                      link: linkToEditWithoutCheckingOutNewVersion,
                  },
              ]
            : []),
    ]

    return (
        <motion.div
            initial={{ opacity: 0, top: 5 }}
            animate={{ opacity: 1, top: 0 }}
            className="relative"
            data-testid={`card-${policy?.UUID}`}>
            <Card className="relative w-full mb-4">
                <button
                    className="absolute z-10 p-3 text-gray-600 rounded-md cursor-pointer right-3 top-4 hover:bg-pzh-gray-100 hover:text-gray-800"
                    onClick={() => setDropdown(!dropdown)}>
                    <EllipsisVertical />
                </button>

                <Dropdown
                    items={dropdownItems}
                    isOpen={dropdown}
                    setIsOpen={setDropdown}
                    className="right-[17px]"
                />

                <PopUpChangePolicyStatus
                    isOpen={statusPopup}
                    setIsOpen={setStatusPopup}
                    policy={policy}
                    titleSingular={titleSingular}
                />

                <PopUpAddPolicyToModule
                    isOpen={modulesPopup}
                    setIsOpen={setModulesPopup}
                    policy={policy}
                    titleSingular={titleSingular}
                />

                <LeftLineIndicator lastItem={lastItem === true} type={type} />

                <div
                    className={classNames('left-[2px]', {
                        'ml-12 relative': type === 'checked out',
                        'ml-6': type === 'valid' || type === 'archived',
                    })}>
                    <Text>{titleSingular}</Text>
                    <div className="relative z-10 flex-wrap pr-4">
                        <Heading className="inline mr-3" level="3">
                            {policy.Titel}
                        </Heading>
                        <div className="relative inline-flex -mt-1">
                            {type === 'archived' ? (
                                <Badge
                                    variant="lightGreen"
                                    className="mr-2"
                                    upperCase={false}
                                    text="Vigerend (Buiten werking)"
                                />
                            ) : (
                                <Badge
                                    variant={
                                        type === 'valid'
                                            ? 'lightGreen'
                                            : 'lightRed'
                                    }
                                    className="mr-2"
                                    upperCase={false}
                                    text={policy.Status || ''}
                                />
                            )}
                            {policyIsInAModule
                                ? policy.Ref_Beleidsmodules?.map(module => (
                                      <Badge
                                          key={module.UUID}
                                          variant={'gray'}
                                          upperCase={false}
                                          text={module.Titel || ''}
                                          className="mr-2"
                                      />
                                  ))
                                : null}
                        </div>
                    </div>
                    <div className="mt-2">
                        {type === 'checked out' && (
                            <Hyperlink
                                to={`/muteer/${overviewSlug}/${policy.ID}/bewerk`}
                                text="Bewerken"
                                icon={ArrowUpRightFromSquare}
                            />
                        )}
                        {type === 'valid' && (
                            <Hyperlink
                                to={`/${overviewSlug}/${policy.UUID}`}
                                text={`Bekijk ${titleSingular.toLowerCase()}`}
                                icon={ArrowUpRightFromSquare}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

type LeftLineIndicatorProps = {
    type: PossibleCardTypes
    lastItem: boolean
}

const LeftLineIndicator = ({
    type,
    lastItem = false,
}: LeftLineIndicatorProps) => {
    if (type === 'checked out') {
        return (
            <div>
                <ColoredBall
                    color="red"
                    className="top-[5px]"
                    style={{
                        marginLeft: 'calc(1.5rem - 4px)',
                    }}
                    animated
                />
                <div
                    style={{
                        marginLeft: 'calc(1.5rem + 2px)',
                        height: 'calc(100% - 1.5rem - 10px)',
                    }}
                    className="absolute bottom-0 block w-6 border-l-2 opacity-50 border-pzh-red-light"
                />
            </div>
        )
    } else if (type === 'valid') {
        return (
            <div>
                <ColoredBall
                    color="green"
                    className="top-[5px] -ml-[6px]"
                    animated={true}
                />
                <div className="absolute bottom-0 block w-6 h-full border-l-2 opacity-50 border-pzh-green-light" />
            </div>
        )
    } else if (type === 'archived') {
        return (
            <div>
                <ColoredBall color="green" className="top-[5px] -ml-[6px]" />
                <div
                    className={classNames(
                        'absolute block w-6 border-l-2 opacity-50 border-pzh-green-light',
                        {
                            'h-8 top-0': lastItem,
                            'h-full bottom-0': !lastItem,
                        }
                    )}
                />
            </div>
        )
    } else {
        return null
    }
}

export default PolicyDetailCard
