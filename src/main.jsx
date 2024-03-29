import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import Overlay from "@/views/Overlay";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/overlay/:clientId?"
            element={<Overlay />}
        />
    )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
