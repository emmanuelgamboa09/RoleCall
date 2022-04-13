import { Card, styled } from "@mui/material";

export const SmDownCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
