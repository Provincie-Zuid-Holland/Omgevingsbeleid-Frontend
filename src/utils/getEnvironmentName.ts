import { Environment } from '@/api/instance'

/**
 *
 * @param {string} environment - type of environment
 * @returns {string} - Text for the banner indicating the environment
 */
const getEnvironmentText = (environment: Environment): string => {
    switch (environment) {
        case 'dev':
            return 'Ontwikkelomgeving'
        case 'test':
            return 'Testomgeving'
        case 'acc':
            return 'Acceptatieomgeving'
        case 'prod':
            return 'Live-omgeving'
        default:
            return 'No environment set'
    }
}

export default getEnvironmentText
