import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import { ChatState } from "../context/ChatProvider";
import UserNavbar from "./UserNavbar";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Avatar,
  Box,
  List,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import UserListItem from "./UserListItem";
import { useEffect } from "react";

const Chats = () => {
  // state for rendering of searched users
  const [searchedUser, setSearchedUser] = useState([]);
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  let inpRef = useRef("");
  // state for snackbar
  const [open, setOpen] = useState({
    openSnack: false,
    severity: "",
    msg: "",
  });
  // function handles the snackbar
  const handleClose = () => {
    if (open.openSnack) {
      open.openSnack = false;
    } else {
      open.openSnack = true;
    }
    setOpen({ ...open });
  };
  // function searches the users
  const searchHandler = async (e) => {
    e.preventDefault();
    let val = inpRef.current.value;
    if (val !== "") {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${val}`, config);
        console.log(data);
        setSearchedUser(data);
      } catch (error) {
        open.msg = error.response.data.message;
        open.severity = "error";
        handleClose();
        console.log(error);
      }
    } else {
      open.msg = "Please fill something to search!!";
      open.severity = "error";
      handleClose();
    }
    setOpen({ ...open });
  };
  // function start chats with the selected user after searching
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setSearchedUser([]);
    } catch (error) {
      console.log(error);
    }
  };
  // function fetches all the chats of the logged in user
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };
  // calling the function fetchChats in useEffect
  useEffect(() => {
    fetchChats();
  }, []);
  // function for rendering the chats name
  const getSender = (users) => {
    return users[0]._id === user._id ? users[1].name : users[0].name;
  };
  // function for rendering the chats pic
  const getAvatar = (users) => {
    if (users.isGroupChat) {
      return "https://cdn-icons-png.flaticon.com/512/1870/1870051.png";
    } else {
      return users.users[0]._id === user._id
        ? users.users[1].pic
        : users.users[0].pic;
    }
  };
  // function for rendering email
  const getSenderEmail = (users) => {
    if (users.isGroupChat) {
      return "Group chat";
    } else {
      return users.users[0]._id === user._id
        ? users.users[1].email
        : users.users[0].email;
    }
  };
  // function set the state for selected chat
  const selectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="col-3 border-end  border-secondary-subtle">
      <UserNavbar />
      {/* rendering of snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
      <Tooltip title="Search Users To start a chat">
        {/* sendering of input field for searching the users */}
        <Form className="p-2" onSubmit={searchHandler}>
          <FormGroup className="d-flex flex-row align-items-center border rounded p-1">
            <SearchIcon />
            <Form.Control
              placeholder="Search Users To Start Chat..."
              className="border-0"
              ref={(ref) => (inpRef.current = ref)}
            />
          </FormGroup>
        </Form>
      </Tooltip>
      {/* rendering of searched users lists */}
      <List>
        {searchedUser.length > 0 ? (
          searchedUser.map((user) => {
            return (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            );
          })
        ) : (
          <></>
        )}
      </List>
      {/* rendering of chats */}
      {chats ? (
        <Box sx={{ height: "80vh", overflowY: "scroll" }}>
          {chats.map((chat) => {
            return (
              <Box
                onClick={() => selectChat(chat)}
                className="btn__color"
                cursor="pointer"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  cursor: "pointer",
                  marginBottom: "5px",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white",
                }}
                background={selectedChat === chat ? "pink" : "grey"}
                key={chat._id}
              >
                <Avatar src={getAvatar(chat)} />
                <Box>
                  <Typography variant="body2">
                    {!chat.isGroupChat ? getSender(chat.users) : chat.chatName}
                  </Typography>
                  <Typography variant="caption">
                    {!chat.isGroupChat ? getSenderEmail(chat) : chat.chatName}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chats;
