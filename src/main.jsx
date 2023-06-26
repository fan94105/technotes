import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { disableReactDevTools } from "@fvilers/disable-react-devtools"

import { Provider } from "react-redux"
import { store } from "./app/store"

import App from "./App.jsx"
import "./index.css"

if (process.env.NODE_ENV === "production") {
  disableReactDevTools()
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
)
