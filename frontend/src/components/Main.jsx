import React from "react";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import axios from "axios";
import Chats from "./Chats";
import ChatProvider from "../context/ChatProvider";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

const Main = () => {
  const fetchChatsData = async () => {
    // const data = await axios.get("/api/chat");
    // setChatsData(data.data);
  };
  useEffect(() => {
    fetchChatsData();
  }, []);
  // console.log(chatsData);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ChatProvider>
          <HomePage />
        </ChatProvider>
      ),
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/chatpage",
      element: <ChatPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Main;
