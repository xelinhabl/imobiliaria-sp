import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

const AnimatedSection = ({ children, animation, delay }) => {
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <Box
      sx={{
        animation: `${fadeIn} 1s ease-out`,
        animationDelay: `${delay || 0}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedSection;