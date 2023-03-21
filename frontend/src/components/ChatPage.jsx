import {
  Alert,
  Avatar,
  Box,
  IconButton,
  Snackbar,
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
import SendIcon from "@mui/icons-material/Send";
import { useRef } from "react";
import axios from "axios";

const ChatPage = () => {
  // using chat
  const { user, selectedChat } = ChatState();
  // state for message field
  const [msgVal, setMsgVal] = useState("");
  // state for rendering the pic and name of chats
  const [userChat, setUserChat] = useState({ name: "", pic: "" });
  // state for rendring the messages
  const [messages, setMessages] = useState([]);
  // state for snackbar
  const [open, setOpen] = useState({
    openSnack: false,
    severity: "",
    msg: "",
  });
  // ref for setting the scrollbar to bottom of the chats
  const bottomRef = useRef(null);
  // function handles the snackbar
  const handleClose = () => {
    if (open.openSnack) {
      open.openSnack = false;
    } else {
      open.openSnack = true;
    }
    setOpen({ ...open });
  };
  // function gets all the messages
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
      setMessages(data);
    } catch (error) {
      open.msg = error.console.log(error);
    }
  };
  // function scrolls to bottom of the page
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // function sets the profile pic and name of selected chat
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
  // function sends the messages
  const sendMessage = async (e) => {
    e.preventDefault();
    if (msgVal !== "") {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/messages",
          { content: msgVal, chatId: selectedChat._id },
          config
        );
        messages.push(data);
        setMessages([...messages]);
        e.target.reset();
        setMsgVal("");
      } catch (error) {
        console.log(error);
      }
    } else {
      open.severity = "error";
      open.msg = "type something to send!!";
      handleClose();
    }
    setOpen({ ...open });
  };

  return (
    <Box className="col-9">
      {/* rendering of snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open.openSnack}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={open.severity}
          sx={{ width: "100%" }}
        >
          {open.msg}
        </Alert>
      </Snackbar>
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
      {/* rendering of messages div */}
      <Box sx={{ height: "90vh", overflowY: "scroll" }} position="relative">
        {messages.length > 0 ? (
          <Box>
            {messages.map((item) => {
              if (item.sender._id === user._id) {
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    marginBottom="10px"
                    marginRight="5px"
                  >
                    <Typography variant="caption">You</Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      padding="8px"
                      gap="5px"
                      borderRadius="10px"
                      sx={{ background: "#52b879" }}
                    >
                      <Typography>{item.content}</Typography>
                      <Avatar
                        src={item.sender.pic}
                        alt=""
                        sx={{ width: 24, height: 24 }}
                      />
                    </Box>
                    <Typography variant="caption">{item.createdAt}</Typography>
                  </Box>
                );
              } else {
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    marginLeft="5px"
                    marginBottom="10px"
                  >
                    <Typography variant="caption">
                      {item.sender.name}
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      borderRadius="10px"
                      padding="8px"
                      gap="5px"
                      sx={{ background: "#dce2df" }}
                    >
                      <Typography>{item.content}</Typography>
                      <Avatar
                        src={item.sender.pic}
                        alt=""
                        sx={{ width: 24, height: 24 }}
                      />
                    </Box>
                    <Typography variant="caption">{item.createdAt}</Typography>
                  </Box>
                );
              }
            })}
            <div ref={(ref) => (bottomRef.current = ref)}></div>
          </Box>
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
        <form
          className="col-9 d-flex flex-row justify-content-center align-items-center position-fixed bottom-0 end-0
          "
          onSubmit={(e) => sendMessage(e)}
        >
          <TextField
            className="col-9"
            onChange={(e) => setMsgVal(e.target.value)}
          />
          <IconButton type="submit">
            <SendIcon sx={{ color: "#52b879" }} />
          </IconButton>
        </form>
      </Box>
    </Box>
  );
};

export default ChatPage;
