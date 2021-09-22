import "react-app-polyfill/ie11"
import "promise-polyfill/src/polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { LastLocationProvider } from "react-router-last-location"

import App from "./App/index"
import ScrollToTop from "./components/ScrollToTop"
import * as serviceWorker from "./serviceWorker"

import { BrowserRouter } from "react-router-dom"

import { polyfills } from "./utils/polyfills.js"

polyfills()

ReactDOM.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LastLocationProvider>
            <ScrollToTop />
            <App />
        </LastLocationProvider>
    </BrowserRouter>,
    document.getElementById("root")
)

serviceWorker.unregister()
