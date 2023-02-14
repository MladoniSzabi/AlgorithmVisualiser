import { createBrowserRouter, Outlet } from "react-router-dom";

import AlgorithmPage from "pages/AlgorithmPage";
import BrowsePage from "pages/BrowsePage"
import ErrorPage from "pages/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/algs-website/",
        element: <Outlet></Outlet>,
        children: [
            {
                path: "",
                element: <BrowsePage></BrowsePage>,
                errorElement: <ErrorPage></ErrorPage>
            },
            {
                path: ":algorithmName",
                element: <AlgorithmPage></AlgorithmPage>
            }
        ]
    }
])

export default router