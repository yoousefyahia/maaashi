import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./Styles/global.css";
import "./Styles/variables.css";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
      </CookiesProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
