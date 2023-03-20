import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import { Form } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const GroupModal = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
  };
  const [group, setGroup] = useState([]);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    registeredUsers,
    setRegisteredUsers,
  } = ChatState();
  const getAllUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/user", config);
      setRegisteredUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const addUser = (item) => {
    group.push(item._id);
    setGroup(group);
    let cond = (ele) => item._id === ele._id;
    let ind = registeredUsers.findIndex(cond);
    registeredUsers.splice(ind, 1);
    setRegisteredUsers([...registeredUsers]);
  };
  const createGroup = async (e) => {
    e.preventDefault();
    if (groupChatName !== "" && group.length > 1) {
      let users = JSON.stringify(group);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/chat/group",
          { users, name: groupChatName },
          config
        );
        chats.push(data);
        setChats([...chats]);
        props.groupModal();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("group name must be filled and group contains atleats 2 peoples");
    }
  };
  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Create A Group Chat</Typography>
          <IconButton onClick={props.groupModal}>X</IconButton>
        </Box>
        <Box>
          <Form onSubmit={(e) => createGroup(e)}>
            <TextField
              label="Enter The Group Name"
              sx={{ marginBottom: "2px" }}
              onChange={(e) => setGroupChatName(e.currentTarget.value)}
            />
            {/* <TextField label="Select Users to add to a group" /> */}
            <Box display="flex" flexWrap="wrap" gap="2px" padding="2px">
              {registeredUsers.map((item) => {
                return (
                  <Typography
                    variant="label1"
                    sx={{
                      background: "#52b879",
                      color: "black",
                      padding: "5px",
                      cursor: "pointer",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                    onClick={() => addUser(item)}
                  >
                    {item.name}
                  </Typography>
                );
              })}
            </Box>
            <Button variant="contained" type="submit">
              Create Group
            </Button>
          </Form>
        </Box>
      </Box>
    </Modal>
  );
};

export default GroupModal;
