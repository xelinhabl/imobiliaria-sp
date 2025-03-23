import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CustomArrow = ({ direction, onClick, hidden }) => {
  if (hidden) return null;

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        left: direction === "left" ? 0 : "auto",
        right: direction === "right" ? 0 : "auto",
      }}
    >
      {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
    </IconButton>
  );
};

export default CustomArrow;