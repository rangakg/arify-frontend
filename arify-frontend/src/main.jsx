import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

function normalizePath() {
  if (window.location.pathname.endsWith("/index.html")) {
    const newPath =
      window.location.pathname.replace("/index.html", "") +
      window.location.search +
      window.location.hash;

    window.history.replaceState(null, "", newPath || "/");
  }
}

normalizePath();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
