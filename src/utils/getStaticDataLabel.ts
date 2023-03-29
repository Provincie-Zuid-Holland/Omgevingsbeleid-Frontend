import { ModelPatchStaticType } from '@/config/objects/types'

const getStaticDataLabel = (key: keyof ModelPatchStaticType) => {
    switch (key) {
        case 'Client_1_UUID':
            return 'Ambtelijk opdrachtgever'
        case 'Owner_1_UUID':
            return 'Eerste eigenaar'
        case 'Owner_2_UUID':
            return 'Tweede eigenaar'
        case 'Portfolio_Holder_1_UUID':
            return 'Eerste portefeuillehouder'
        case 'Portfolio_Holder_2_UUID':
            return 'Tweede portefeuillehouder'
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ModelPatchStaticType...`
            )
    }
}

export default getStaticDataLabel
