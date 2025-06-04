import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FileUpload from "./FileUpload.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.tsx";
import SearchPage from "./Search.tsx";
import DocumentViewPage from "./DocumentView.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/fileUpload",
    element: <FileUpload />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/view-document/:chunkId",
    element: <DocumentViewPage />,
  },
  {
    path: "*",
    element: <Home />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
