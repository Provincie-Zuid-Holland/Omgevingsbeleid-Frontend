import { LoaderContent } from '@/components/Loader'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import useModule from '@/hooks/useModule'

const TabTimeline = () => {
    const { data: { module, status_history: statusHistory } = {}, isLoading } =
        useModule()

    if (isLoading || !module) return <LoaderContent />

    return (
        <div className="grid grid-cols-6 gap-x-10 gap-y-0 pt-6">
            <div className="col-span-6">
                {module.activated && statusHistory && (
                    <ModuleTimeline statusHistory={statusHistory} />
                )}
            </div>
        </div>
    )
}

export default TabTimeline
