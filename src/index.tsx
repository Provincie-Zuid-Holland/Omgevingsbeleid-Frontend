import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'

import App from './App'
import ScrollToTop from './components/ScrollToTop'
import * as serviceWorker from './serviceWorker'
import { polyfills } from './utils/polyfills.js'

polyfills()

ReactDOM.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LastLocationProvider>
            <ScrollToTop />
            <App />
        </LastLocationProvider>
    </BrowserRouter>,
    document.getElementById('root')
)

serviceWorker.unregister()
