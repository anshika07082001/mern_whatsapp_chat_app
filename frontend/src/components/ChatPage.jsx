import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { ChatState } from "../context/ChatProvider";
import VideocamIcon from "@mui/icons-material/Videocam";

const ChatPage = () => {
  const { user } = ChatState();
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
          <Avatar src={user.pic} />
          <Typography variant="subtitle2">{user.name}</Typography>
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
    </Box>
  );
};

export default ChatPage;
