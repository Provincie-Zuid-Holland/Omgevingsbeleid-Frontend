import {
    useRegulationsGet,
    useRegulationsPost,
    useRegulationsRegulationUuidPost,
} from '@/api/fetchers'

import { default as belang } from './belang'
import { default as taak } from './taak'

const regulations = {
    fetchers: {
        useGet: useRegulationsGet,
        usePost: useRegulationsPost,
        usePatch: useRegulationsRegulationUuidPost,
    },
}

export default regulations
export { belang, taak }
