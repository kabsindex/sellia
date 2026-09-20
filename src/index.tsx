import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const rootEl = document.getElementById("root");
if (rootEl) {
  document.documentElement.classList.remove("dark");
  window.localStorage.removeItem("sellia:theme");
  ReactDOM.createRoot(rootEl).render(<App />);
}
