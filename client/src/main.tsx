import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import { StyledEngineProvider } from '@mui/material/styles';

const root = document.getElementById("root");
if (root) ReactDOM.createRoot(root).render(
    <StyledEngineProvider injectFirst>
        <App />
    </StyledEngineProvider>
);
