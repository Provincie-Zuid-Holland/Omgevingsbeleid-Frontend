import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import ScrollToTop from './components/ScrollToTop'
import { polyfills } from './utils/polyfills.js'

polyfills()

const container = document.getElementById('root')

// Create a root.
const root = createRoot(container!)

root.render(
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
)
