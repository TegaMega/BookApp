import About from "./pages/About";
import HomeLayout from "./pages/HomeLayout";
import LandingPage from "./pages/LandingPage";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SingleBook from "./pages/SingleBook";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import { Toaster } from "react-hot-toast";
import Bookshelf from "./pages/Bookshelf";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { authCheck } from "../slice/userSlice"; // ✅ fixed import path
import Loading from "./components/Loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // optional: prevents refetching when window regains focus
      retry: 1, // optional: number of retry attempts on failure
      staleTime: 1000 * 60 * 5, // optional: data stays fresh for 5 minutes
    },
  },
});

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCheckingAuth, user } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(authCheck());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "about", element: <About /> },
        {
          path: "works/:id",
          element: user ? <SingleBook /> : <Navigate to="/login" />,
        },
        {
          path: "bookshelf",
          element: user ? <Bookshelf /> : <Navigate to="/login" />,
        },
        {
          path: "bookshelf/:id",
          element: user ? <SingleBook /> : <Navigate to="/login" />,
        },
        {
          path: "search/:id",
          element: user ? <SingleBook /> : <Navigate to="/login" />,
        },
        {
          path: "search",
          element: user ? <SearchPage /> : <Navigate to="/login" />,
        },
      ],
    },
    { path: "signup", element: !user ? <Signup /> : <Navigate to="/" /> },
    { path: "login", element: !user ? <Login /> : <Navigate to="/" /> },
  ]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
