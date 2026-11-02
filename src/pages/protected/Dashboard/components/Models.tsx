import { Heading } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { Model } from '@/config/objects/types'

const Models = () => (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.keys(models).map(key => {
            const model = models[key as keyof typeof models]

            if (model.defaults.disabled) return null

            return <ModelTile key={`model-${key}`} model={model} />
        })}
    </div>
)

const ModelTile = ({ model }: { model: Model }) => {
    const { icon: Icon, plural, pluralCapitalize } = model.defaults

    return (
        <Link to={`/muteer/${plural}`} data-testid="dashboard-model-tile">
            <div className="group flex items-center justify-between rounded border border-pzh-gray-200 px-6 py-7">
                <div className="flex items-center">
                    <Icon size={20} className="mr-4 text-pzh-blue-500" />
                    <Heading level="3" size="s">
                        {pluralCapitalize}
                    </Heading>
                </div>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={18} className="text-pzh-green-500" />
                </div>
            </div>
        </Link>
    )
}

export default Models
