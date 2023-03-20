import React from "react";
import { Navbar } from "react-bootstrap";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ChatState } from "../context/ChatProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import GroupModal from "./GroupModal";

const UserNavbar = () => {
  const { user } = ChatState();

  let navigate = useNavigate("/login");
  const [open, setOpen] = useState({
    menu: false,
    profile: false,
    group: false,
  });
  const openMenu = () => {
    setOpen({ menu: true });
  };
  const profileModal = () => {
    if (open.profile) {
      open.profile = false;
    } else {
      open.profile = true;
      open.menu = false;
    }
    setOpen({ ...open });
  };
  const logoutHandler = () => {
    localStorage.removeItem("loginUser");
    navigate("/login");
  };
  const handleClose = () => {
    setOpen({ menu: false });
  };
  const groupModal = () => {
    if (open.group) {
      open.group = false;
    } else {
      open.group = true;
    }
    setOpen({ ...open });
  };
  return (
    <>
      <Navbar className="d-flex flex-row bg-body-secondary justify-content-between align-items-center p-1">
        <Tooltip title={user.name}>
          <Avatar src={user.pic} sx={{ bgcolor: "#dadada" }} />
        </Tooltip>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Tooltip title="Create New Group">
            <IconButton onClick={groupModal}>
              <GroupsIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={openMenu} id="demo-positioned-button">
            <MoreVertIcon fontSize="medium" />
          </IconButton>
          <Menu
            id="basic-menu"
            aria-labelledby="demo-positioned-button"
            open={open.menu}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={profileModal}>Profile</MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Navbar>
      {open.profile ? (
        <ProfileModal open={open.profile} profileModal={profileModal} />
      ) : (
        <></>
      )}
      {open.group ? (
        <GroupModal open={open.group} groupModal={groupModal} />
      ) : (
        <></>
      )}
    </>
  );
};

export default UserNavbar;
