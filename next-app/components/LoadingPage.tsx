import { Box, CircularProgress } from "@mui/material";
import { FC } from "react";
import theme from "../src/theme";

interface LoadingPageProps {}

const LoadingPage: FC<LoadingPageProps> = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <CircularProgress size={125} thickness={2} />
    </Box>
  );
};

export default LoadingPage;
