import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "./contexts/AuthProvider.jsx";
import router from "./routes/Routes.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";

console.log("main.jsx loaded");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
