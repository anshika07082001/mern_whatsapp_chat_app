import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatPage from "./ChatPage";
import Chats from "./Chats";

const HomePage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user, selectedChat } = ChatState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loginUser"));
    if (userInfo) {
      navigate("/");
    }
  }, [location.pathname]);

  return (
    <div className="col-12 d-flex flex-row" style={{ height: "100vh" }}>
      {user && <Chats />}
      {selectedChat === undefined ? (
        <Box className="col-9 d-flex justify-content-center align-items-center">
          <img
            src="https://tm.ibxk.com.br/2021/11/05/05144353371253.jpg"
            alt=""
            className="col-6"
          />
        </Box>
      ) : (
        <ChatPage />
      )}
    </div>
  );
};

export default HomePage;
