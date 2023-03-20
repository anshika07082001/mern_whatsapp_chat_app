import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import React from "react";
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
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { users, chats, setChats } = useState(ChatState);
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
          <Form>
            <TextField label="Enter The Group Name" />
            <TextField label="Select Users to add to a group" />
          </Form>
        </Box>
      </Box>
    </Modal>
  );
};

export default GroupModal;
