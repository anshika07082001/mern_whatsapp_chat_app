import React from "react";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import ChatProvider from "../context/ChatProvider";

const ProtectedHoc = ({ children }) => {
  let chatContext = useContext(ChatProvider);
  let location = useLocation();

  console.log(chatContext);
};

export default ProtectedHoc;
