import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import ScrollToTop from './components/ScrollToTop'

const container = document.getElementById('root')

// Create a root.
const root = createRoot(container!)

root.render(
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
)
