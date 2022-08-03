import { CommentDots } from '@pzh-ui/icons'

import formatDate from '@/utils/formatDate'

/**
 * @returns The clients browser name
 */
const getBrowserName = () => {
    let sBrowser
    const sUsrAg = navigator.userAgent

    // The order matters here, and this may report false positives for unlisted browsers.
    if (sUsrAg.indexOf('Firefox') > -1) {
        sBrowser = 'Mozilla Firefox'
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
        sBrowser = 'Samsung Internet'
        // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
        sBrowser = 'Opera'
        // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf('Trident') > -1) {
        sBrowser = 'Microsoft Internet Explorer'
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf('Edge') > -1) {
        sBrowser = 'Microsoft Edge'
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf('Chrome') > -1) {
        sBrowser = 'Google Chrome'
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf('Safari') > -1) {
        sBrowser = 'Apple Safari'
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
        sBrowser = 'unknown'
    }

    return sBrowser
}

/**
 * Create a mailto link with subject and body
 */
const getMailToLink = () => {
    const date = formatDate(new Date(), 'd MMMM yyyy, HH:mm') + ' uur'

    const browser = getBrowserName()
    return `mailto:omgevingsbeleid@pzh.nl?subject=Feedback%20obzh.nl%20(${date})&body=Ik%20heb%20feedback%20op%20de%20website.%20Ik%20heb%20de%20website%20bekeken%20met%20${browser}%20en%20heb%20de%20volgende%20feedback%3A%0D%0A`
}

/**
 * Feedback component with mailto anchor
 */
const FeedbackComponent = () => {
    const mailTo = getMailToLink()

    return (
        <div className="fixed bottom-0 left-0 z-10 w-full pointer-events-none">
            <div className="container relative flex px-6 pt-0 mx-auto sm:mt-8 sm:py-10 sm:px-6 lg:px-8">
                <a
                    href={mailTo}
                    className={`absolute pointer-events-auto bottom-0 px-3 pt-2 pb-3 font-bold text-white transition duration-200 ease-out transform translate-y-2 cursor-pointer rounded-t-md bg-pzh-red hover:translate-y-0 left-0 ml-4`}>
                    <CommentDots
                        size={20}
                        className="mr-2 -mt-[2px] text-white inline-block"
                    />
                    Feedback
                </a>
            </div>
        </div>
    )
}

export default FeedbackComponent
export { getMailToLink }
