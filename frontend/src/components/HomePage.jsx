import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatPage from "./ChatPage";
import Chats from "./Chats";

const HomePage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = ChatState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loginUser"));
    if (userInfo) {
      navigate("/");
    }
  }, [location.pathname]);

  return (
    <div className="col-12 d-flex flex-row">
      {user && <Chats />}
      {user && <ChatPage />}
    </div>
  );
};

export default HomePage;
