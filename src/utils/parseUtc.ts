import { parseISO } from 'date-fns'

export const parseUtc = (s: string) => parseISO(s.endsWith('Z') ? s : `${s}Z`)
