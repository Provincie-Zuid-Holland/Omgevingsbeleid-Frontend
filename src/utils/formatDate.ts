/**
 * Eslint needs to be disabled for these imports,
 * otherwise eslint will merge them together causing a conflict.
 */

// eslint-disable-next-line
import { format } from 'date-fns'
// eslint-disable-next-line
import nlLocale from 'date-fns/locale/nl'

const formatDate = (date: Date, dateFormat: string) =>
    format(date, dateFormat, { locale: nlLocale })

export default formatDate
