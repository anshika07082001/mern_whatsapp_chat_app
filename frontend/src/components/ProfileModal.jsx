import { Box, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import { ChatState } from "../context/ChatProvider";

const ProfileModal = (props) => {
  // styling of modal
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
  const { user } = ChatState();

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
          <Typography variant="h6">{user.name}</Typography>
          <IconButton onClick={props.profileModal}>X</IconButton>
        </Box>
        <Box textAlign="center">
          <img
            src={user.pic}
            style={{ width: "50%", height: "50%" }}
            className="rounded-circle"
            alt=""
          />
          <Typography>User Email: {user.email}</Typography>
          <Typography>User Phone Number: {user.phone}</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
