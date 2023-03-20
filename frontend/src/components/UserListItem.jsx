import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <ListItem onClick={handleFunction}>
      <ListItemAvatar>
        <Avatar src={user.pic} />
      </ListItemAvatar>
      <ListItemText primary={user.name} />
      <small>{user.email}</small>
    </ListItem>
  );
};

export default UserListItem;
