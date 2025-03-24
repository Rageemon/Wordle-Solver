
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";


// Create a client
createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Router basename="/Wordle-Solver/">
    
        <App />
      </Router>
  </StrictMode>,
);
