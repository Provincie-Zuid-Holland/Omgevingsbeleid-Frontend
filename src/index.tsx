import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'

import App from './App'
import ScrollToTop from './components/ScrollToTop'
import { polyfills } from './utils/polyfills.js'

polyfills()

const container = document.getElementById('root')

// Create a root.
const root = createRoot(container!)

root.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LastLocationProvider>
            <ScrollToTop />
            <App />
        </LastLocationProvider>
    </BrowserRouter>
)
