import { createBrowserRouter } from "react-router-dom";
import { SearchPage } from "./components/pages/SearchPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { RootLayout } from "./layout/RootLayout";

export const router = createBrowserRouter([
    {
        element: <RootLayout/>,
        children: [


            {
                path: '/',
                element: <SearchPage />
            },
            {
                path: '/history',
                element: <HistoryPage/>
            }
        ]
    }
])