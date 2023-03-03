import { createBrowserRouter } from "react-router-dom";

import AlgorithmPage from "pages/AlgorithmPage";
import BrowsePage from "pages/BrowsePage"
import ErrorPage from "pages/ErrorPage";
import NewAlgorithm from "pages/NewAlgorithmPage";
import HelpPage from "pages/HelpPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <BrowsePage></BrowsePage>,
        errorElement: <ErrorPage></ErrorPage>
    },
    {
        path: "algorithm/:algorithmName",
        element: <AlgorithmPage></AlgorithmPage>
    },
    {
        path: "new-algorithm",
        element: <NewAlgorithm></NewAlgorithm>
    },
    {
        path: "help",
        element: <HelpPage></HelpPage>
    }
])

export default router