import {
  Avatar,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { ChatState } from "../context/ChatProvider";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import { useRef } from "react";
import axios from "axios";

const ChatPage = () => {
  const { user, selectedChat } = ChatState();
  const [msgVal, setMsgVal] = useState("");
  const [userChat, setUserChat] = useState({ name: "", pic: "" });
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      console.log(data);
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedChat.isGroupChat) {
      userChat.name = selectedChat.chatName;
      userChat.pic = "https://cdn-icons-png.flaticon.com/512/1870/1870051.png";
    } else {
      if (selectedChat.users[0]._id === user._id) {
        userChat.name = selectedChat.users[1].name;
        userChat.pic = selectedChat.users[1].pic;
      }
    }
    setUserChat({ ...userChat });
    getMessages();
  }, [selectedChat]);

  const sendMessage = () => {
    console.log(msgVal);
  };

  return (
    <Box className="col-9">
      <Box
        display="flex"
        flexdirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderLeft="1px solid grey"
        sx={{
          background: "#e9ecef",
        }}
      >
        <Box
          display="flex"
          flexdirection="row"
          alignItems="center"
          gap="1em"
          padding="5px"
        >
          <Avatar src={userChat.pic} />
          <Typography variant="subtitle2">{userChat.name}</Typography>
        </Box>
        <Box marginRight="20px">
          <Tooltip title="vedio call">
            <IconButton>
              <VideocamIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="phone call">
            <IconButton>
              <LocalPhoneIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ height: "90vh", overflowY: "scroll" }}>
        {messages.length > 0 ? (
          messages.map((item) => {
            return <p>{item.content}</p>;
          })
        ) : (
          <Box
            padding="10px"
            className="col-6"
            display="flex"
            margin="auto"
            sx={{ background: "#fff4c1" }}
          >
            <Typography>
              Messages and calls are end-to-end encrypted. No one outside this
              chat, not even Whatsapp, can read or listen to them. Tap to learn
              more...
            </Typography>
          </Box>
        )}
        <form className="col-12 d-flex flex-row justify-content-center align-items-center ">
          <TextField
            className="col-9"
            onChange={(e) => setMsgVal(e.target.value)}
          />
          <IconButton onClick={sendMessage}>
            <SendIcon sx={{ color: "#52b879" }} />
          </IconButton>
        </form>
      </Box>
    </Box>
  );
};

export default ChatPage;
