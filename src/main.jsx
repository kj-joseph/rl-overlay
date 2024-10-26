import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import Overlay from "@/views/overlay/Overlay";
import Statboard from "@/views/Statboard";

import ("@/style/appMain.scss");

const router = createBrowserRouter(
    createRoutesFromElements(
		<Route path="/">
			<Route
				path="/overlay/:clientId?"
				element={<Overlay />}
			/>
			<Route
				path="/stats/:clientId?"
				element={<Statboard />}
			/>
		</Route>
    )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
