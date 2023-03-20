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
    alert();
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
      console.log(data);
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
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };
  return (
    <div className="col-3">
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
        <List overflowY="scroll">
          {chats.map((chat) => {
            return (
              <Box
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
                <Avatar src={getAvatar(loggedUser, chat.users)} />
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            );
          })}
        </List>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chats;
