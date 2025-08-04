import { Heading } from '@pzh-ui/components'

import { LoaderSpinner } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import useObject from '@/hooks/useObject'

const ObjectActiveModules = () => {
    const { activeModules, activeModulesLoading } = useObject()

    return (
        <div>
            <Heading level="3" className="mb-4">
                Modules
            </Heading>

            {activeModulesLoading ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : !!activeModules?.length ? (
                <ul className="grid grid-cols-1 gap-9 lg:grid-cols-2">
                    {activeModules.map(object => (
                        <ModuleTile
                            key={object.Module_Object.UUID}
                            {...object.Module}
                        />
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
