import { createBrowserRouter } from "react-router-dom";

import AlgorithmPage from "pages/AlgorithmPage";
import BrowsePage from "pages/BrowsePage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <BrowsePage></BrowsePage>
    }
])

export default router