import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AdvancedSearch from "./pages/AdvancedSearch";
import BookDetail from "./pages/BookDetail";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/advanced-search", element: <AdvancedSearch /> },
      { path: "/book/:id", element: <BookDetail /> },
    ],
  },
]);
