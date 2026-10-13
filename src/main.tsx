import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Agentation } from "agentation"
import App from "./App"
import { LangProvider } from "@/lib/i18n"
import "./styles.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
      {import.meta.env.DEV && <Agentation />}
    </BrowserRouter>
  </StrictMode>
)
