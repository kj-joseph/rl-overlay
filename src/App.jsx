import React from 'react';
import {
	createBrowserRouter,
	RouterProvider,
  } from "react-router-dom";

import Live from '@/views/Live';

const App = () => {

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Live />,
		},
	]);

	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	)
}

export default App;
