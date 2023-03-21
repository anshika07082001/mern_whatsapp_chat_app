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
  // using context
  const { user } = ChatState();
  // state for handling the menubar
  const [anchorEl, setAnchorEl] = useState(null);
  // state for menu
  const [open, setOpen] = useState({
    menu: false,
    profile: false,
    group: false,
  });
  let navigate = useNavigate("/login");
  // function opens the menu bar onclick of button
  const openMenu = (e) => {
    setOpen({ menu: true });
    setAnchorEl(e.currentTarget);
  };
  // function opens or closes the profile modal
  const profileModal = () => {
    if (open.profile) {
      open.profile = false;
    } else {
      open.profile = true;
      open.menu = false;
    }
    setOpen({ ...open });
  };
  // function logouts the user and navigate to login page
  const logoutHandler = () => {
    localStorage.removeItem("loginUser");
    navigate("/login");
  };
  // function closes the menu bat
  const handleClose = () => {
    setOpen({ menu: false });
  };
  // function opens or closes the groupModal
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
            {/* icon button opens a group modal */}
            <IconButton onClick={groupModal}>
              <GroupsIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          {/* menu icon Button opens the menu bar */}
          <IconButton onClick={openMenu} id="demo-positioned-button">
            <MoreVertIcon fontSize="medium" />
          </IconButton>
          {/* rendering of menu bar */}
          <Menu
            anchorEl={anchorEl}
            id="basic-menu"
            aria-labelledby="demo-positioned-button"
            open={open.menu}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {/* item opens the profile modal */}
            <MenuItem onClick={profileModal}>Profile</MenuItem>
            {/* item logouts the user */}
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Navbar>
      {/* rendering of profile modal */}
      {open.profile ? (
        <ProfileModal open={open.profile} profileModal={profileModal} />
      ) : (
        <></>
      )}
      {/* rendering of profile modal */}
      {open.group ? (
        <GroupModal open={open.group} groupModal={groupModal} />
      ) : (
        <></>
      )}
    </>
  );
};

export default UserNavbar;
