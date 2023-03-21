import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import CloseIcon from "@mui/icons-material/Close";

const GroupModal = (props) => {
  // style for modal
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
  // state for selected users to create group
  const [group, setGroup] = useState([]);
  // state for group name
  const [groupChatName, setGroupChatName] = useState();
  // state for selected users
  const [selectedUsers, setSelectedUsers] = useState([]);
  // using context
  const { user, chats, setChats, registeredUsers, setRegisteredUsers } =
    ChatState();
  // state for snackbar
  const [open, setOpen] = useState({
    openSnack: false,
    severity: "",
    msg: "",
  });
  // function opens or closes the snackbar
  const handleClose = () => {
    if (open.openSnack) {
      open.openSnack = false;
    } else {
      open.openSnack = true;
    }
    setOpen({ ...open });
  };
  // function gets all the registered users to add in a group
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
  // function to adds the user on clicking of particular user
  const addUser = (item) => {
    selectedUsers.push(item);
    group.push(item._id);
    setGroup(group);
    setSelectedUsers(selectedUsers);
    let cond = (ele) => item._id === ele._id;
    let ind = registeredUsers.findIndex(cond);
    registeredUsers.splice(ind, 1);
    setRegisteredUsers([...registeredUsers]);
  };
  // function creates the group on button click
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
        open.msg = error.response.data.message;
        open.severity = "error";
        handleClose();
      }
    } else {
      open.msg =
        "group name must be filled and group contains atleats 2 peoples";
      open.severity = "error";
      handleClose();
    }
    setOpen({ ...open });
  };
  // function deletes the user
  const delUser = (item) => {
    registeredUsers.push(item);
    setRegisteredUsers([...registeredUsers]);
    let cond = (ele) => ele._id === item._id;
    let ind = selectedUsers.findIndex(cond);
    selectedUsers.splice(ind, 1);
    setSelectedUsers([...selectedUsers]);
    let groupInd = group.findIndex((ele) => ele === item._id);
    group.splice(groupInd, 1);
    setGroup([...group]);
  };

  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
            {/* input field to give the name of a group */}
            <TextField
              label="Enter The Group Name"
              sx={{ marginBottom: "2px" }}
              onChange={(e) => setGroupChatName(e.currentTarget.value)}
            />
            {/* rendering of selected users */}
            {selectedUsers.length > 0 ? (
              <>
                <Typography>Selected Users:</Typography>
                <Box display="flex" flexWrap="wrap" gap="2px" padding="2px">
                  {selectedUsers.map((item) => {
                    return (
                      <Typography
                        variant="label1"
                        sx={{
                          background: "#52b879",
                          color: "black",
                          padding: "5px",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                      >
                        {item.name}
                        <CloseIcon
                          fontSize="small"
                          sx={{ cursor: "pointer" }}
                          onClick={() => delUser(item)}
                        />
                      </Typography>
                    );
                  })}
                </Box>
              </>
            ) : (
              <></>
            )}
            {/* rendering of registered users */}
            <Typography>Select Users to Add In a Group:</Typography>
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
