import { createBrowserRouter } from "react-router-dom";
import { SearchPage } from "./components/pages/SearchPage";
import { TopSongsPage } from "./components/pages/TopSongsPage";
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
                path: '/topsongs',
                element: <TopSongsPage/>
            }
        ]
    }
])