import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import { ChatState } from "../context/ChatProvider";
import UserNavbar from "./UserNavbar";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Box, List, Tooltip, Typography } from "@mui/material";
import { useRef } from "react";
import axios from "axios";
import { useState } from "react";
import UserListItem from "./UserListItem";
import { useEffect } from "react";

const Chats = () => {
  const [searchedUser, setSearchedUser] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  let inpRef = useRef("");

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
        setSearchedUser(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("please fill something");
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setSearchedUser([]);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("loginUser")));
    fetchChats();
  }, []);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getAvatar = (loggedUser, users) => {
    if (users.isGroupChat) {
      return "https://cdn-icons-png.flaticon.com/512/1870/1870051.png";
    } else {
      return users.users[0]._id === loggedUser._id
        ? users.users[1].pic
        : users.users[0].pic;
    }
  };
  const selectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="col-3 border-end  border-secondary-subtle">
      <UserNavbar />
      <Tooltip title="Search Users">
        <Form className="p-2" onSubmit={searchHandler}>
          <FormGroup className="d-flex flex-row align-items-center border rounded p-1">
            <SearchIcon />
            <Form.Control
              placeholder="Serach Users..."
              className="border-0"
              ref={(ref) => (inpRef.current = ref)}
            />
          </FormGroup>
        </Form>
      </Tooltip>
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
      {chats ? (
        <Box sx={{ height: "80vh", overflowY: "scroll" }}>
          {chats.map((chat) => {
            return (
              <Box
                onClick={() => selectChat(chat)}
                className="btn__color"
                cursor="pointer"
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
                <Avatar src={getAvatar(loggedUser, chat)} />
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
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
