import { useModulesGetModuleValidate } from '@/api/fetchers'
import { ValidateObject } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    cn,
    Text,
} from '@pzh-ui/components'
import {
    ArrowUpRightFromSquare,
    CircleCheckSolid,
    CircleExclamation,
    CircleXmark,
} from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

type Status = 'initial' | 'pending' | 'valid' | 'failed' | 'warning'

interface StatusItemProps {
    value: string
    title: string
    status: Status
    objects: ValidateObject[]
}

type RuleErrorSummary = {
    count: number
    objects: ValidateObject[]
}

const STATUS_CONFIG: Record<
    Status,
    {
        className: string
        icon: JSX.Element
        expandable: boolean
    }
> = {
    initial: {
        className: 'border-pzh-gray-300',
        icon: (
            <div className="border-pzh-gray-500 h-6 w-6 rounded-full border" />
        ),
        expandable: false,
    },
    pending: {
        className: 'border-pzh-gray-300',
        icon: (
            <div className="border-pzh-gray-500 h-6 w-6 rounded-full border" />
        ),
        expandable: false,
    },
    valid: {
        className: 'border-pzh-green-500 bg-pzh-green-10 text-pzh-green-500',
        icon: (
            <CircleCheckSolid
                size={22}
                className="text-pzh-green-500 min-w-6"
            />
        ),
        expandable: false,
    },
    failed: {
        className: 'border-pzh-red-500 bg-pzh-red-10 text-pzh-red-500',
        icon: <CircleXmark size={22} className="text-pzh-red-500 min-w-6" />,
        expandable: true,
    },
    warning: {
        className: 'border-pzh-yellow-500 bg-pzh-yellow-10',
        icon: (
            <CircleExclamation
                size={22}
                className="text-pzh-blue-500 min-w-6"
            />
        ),
        expandable: true,
    },
}

const SCAN_RULES: Array<{
    ruleKey: string
    dynamicTitle?: (count: number) => string
    defaultTitle: string
}> = [
    {
        ruleKey: 'required_object_fields_rule',
        defaultTitle: 'Verplichte velden ingevuld',
        dynamicTitle: count => `${count} verplichte velden zijn niet ingevuld`,
    },
    {
        ruleKey: 'required_hierarchy_code_rule',
        defaultTitle: 'Primaire koppelingen zijn gekoppeld',
        dynamicTitle: count => `${count} primaire koppelingen ontbreken`,
    },
    // {
    //     ruleKey: 'TODO',
    //     defaultTitle: 'Werkingsgebieden bevatten geo-data'
    // },
    {
        ruleKey: 'newest_source_werkingsgebied_used_rule',
        defaultTitle: 'Geo-data is meest recent',
        dynamicTitle: count =>
            `${count} werkingsgebieden hebben niet de meest recente geo-data`,
    },
]

const ModuleScanModal = () => {
    const queryClient = useQueryClient()

    const { moduleId } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        data,
        isFetching,
        isSuccess,
        refetch: validateModule,
        queryKey,
    } = useModulesGetModuleValidate(Number(moduleId), {
        query: {
            enabled: false,
        },
    })

    const failingRules = useMemo(
        () => new Set(data?.errors?.map(err => err.rule) ?? []),
        [data?.errors]
    )

    const errorSummaryByRule = useMemo<Record<string, RuleErrorSummary>>(() => {
        const summary: Record<string, RuleErrorSummary> = {}

        data?.errors?.forEach(err => {
            const rule = err.rule

            if (!summary[rule]) {
                summary[rule] = {
                    count: 0,
                    objects: [],
                }
            }

            summary[rule].count += err.messages.length
            summary[rule].objects.push(err.object)
        })

        return summary
    }, [data?.errors])

    const getStatus = useCallback(
        (key: string): Status => {
            if (isFetching) return 'pending'
            if (!data) return 'initial'

            if (data.status === 'OK') return 'valid'

            if (data.status === 'Failed') {
                return failingRules.has(key) ? 'failed' : 'valid'
            }

            return 'initial'
        },
        [isFetching, data, failingRules]
    )

    const handleCloseModal = () => {
        queryClient.resetQueries({ queryKey })
        setActiveModal(null)
    }

    return (
        <Modal
            id="moduleScan"
            title="Volledigheidsscan"
            onClose={handleCloseModal}>
            <Accordion type="multiple" className="flex flex-col gap-4">
                {SCAN_RULES.map(rule => {
                    const status = getStatus(rule.ruleKey)
                    const count = errorSummaryByRule[rule.ruleKey]?.count ?? 0
                    const objects = errorSummaryByRule[rule.ruleKey]?.objects

                    const title =
                        status === 'failed' && rule.dynamicTitle
                            ? rule.dynamicTitle(count)
                            : rule.defaultTitle

                    return (
                        <StatusItem
                            key={rule.ruleKey}
                            value={rule.ruleKey}
                            title={title}
                            status={status}
                            objects={objects}
                        />
                    )
                })}
            </Accordion>

            <ModalFooter>
                <Button
                    variant={!isSuccess ? 'link' : 'secondary'}
                    onPress={handleCloseModal}
                    className={cn({ 'ml-auto': isSuccess })}>
                    Annuleren
                </Button>
                {!isSuccess && (
                    <Button variant="cta" onPress={() => validateModule()}>
                        Start scan
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    )
}

const StatusItem = ({ value, title, status, objects }: StatusItemProps) => {
    const { moduleId } = useParams()
    const { className, icon, expandable } = STATUS_CONFIG[status]

    return (
        <AccordionItem
            value={value}
            disabled={!expandable}
            className={cn(
                'w-full min-w-0 flex-1 flex-wrap items-center justify-between gap-4 rounded-lg border px-4 py-2',
                className
            )}>
            <AccordionTrigger
                className={cn('flex w-full py-0 font-normal', {
                    'hover:no-underline': !expandable,
                })}
                hideIcon={!expandable}>
                <div className="flex gap-4">
                    <div className="text-pzh-gray-800 mt-2 flex flex-shrink-0 items-center gap-4 sm:mt-0">
                        {icon}
                    </div>
                    <Text>{title}</Text>
                </div>
                {status === 'pending' && <LoaderSpinner />}
            </AccordionTrigger>
            <AccordionContent className="text-pzh-blue-500 mt-2">
                <ul className="flex flex-col gap-2">
                    {objects?.map(object => (
                        <li
                            key={object.code}
                            className="relative flex items-center pl-6 before:absolute before:-top-1 before:left-2 before:text-3xl before:leading-none before:content-['·']">
                            <Link
                                to={`/muteer/modules/${moduleId}/${object.object_type}/${object.object_id}/bewerk`}
                                className="text-pzh-blue-500 text-s hover:text-pzh-green-500 inline-flex items-center font-bold underline decoration-1">
                                {object.title} ({object.object_type})
                                <ArrowUpRightFromSquare
                                    size={16}
                                    className="ml-1"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    )
}

export default ModuleScanModal
