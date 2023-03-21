import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // state for logged in user
  const [user, setUser] = useState();
  // state for searched selected user to start the chat
  const [selectedChat, setSelectedChat] = useState();
  // state for showing all the chats of logged in user
  const [chats, setChats] = useState([]);
  // state for showing all the registered users
  const [registeredUsers, setRegisteredUsers] = useState([]);
  let navigate = useNavigate();
  let location = useLocation();

  // function checks whether someone is logged in or not if not navigate to login page
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("loginUser"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/login");
    }
  }, [location.pathname]);

  return (
    // context provider
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        registeredUsers,
        setRegisteredUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// export the chatState
export const ChatState = () => {
  // using the chat context
  return useContext(ChatContext);
};

export default ChatProvider;
