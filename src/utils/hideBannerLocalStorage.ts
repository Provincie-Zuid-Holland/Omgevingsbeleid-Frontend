import { isToday, parseISO } from 'date-fns'

// If the user removes the banner a variable gets set in Local Storage.
// This variable is valid for 24 hours and makes sure the banner will not show up again.
const hideBannerLocalStorage = () => {
    const dateHideBanner = localStorage.getItem('__OB_hide_banner__')
    return isToday(parseISO(dateHideBanner || ''))
}

export default hideBannerLocalStorage
