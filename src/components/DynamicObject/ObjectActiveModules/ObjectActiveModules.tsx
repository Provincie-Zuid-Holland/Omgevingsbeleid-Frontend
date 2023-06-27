import { Heading } from '@pzh-ui/components'

import { LoaderSpinner } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import useObject from '@/hooks/useObject'

const ObjectActiveModules = () => {
    const { activeModules, activeModulesLoading } = useObject()

    return (
        <div>
            <Heading as="2" level="3" className="mb-4">
                Modules
            </Heading>

            {activeModulesLoading ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : !!activeModules?.length ? (
                <ul className="grid gap-9 lg:grid-cols-2 grid-cols-1">
                    {activeModules.map(object => (
                        <ModuleCard key={object.UUID} {...object} />
                    ))}
                </ul>
            ) : (
                <p className="italic">
                    Dit object wordt momenteel niet bewerkt in een module.
                </p>
            )}
        </div>
    )
}

export default ObjectActiveModules
