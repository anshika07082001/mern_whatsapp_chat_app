import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loginUser"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/login");
    }
  }, [location.pathname]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
