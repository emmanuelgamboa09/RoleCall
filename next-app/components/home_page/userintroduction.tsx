import React, { FC } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/store";

interface UserIntroductionProps {}

const UserIntroduction: FC<UserIntroductionProps> = () => {
  const user = useSelector(selectUser);
  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemAvatar>
        <Avatar
          id="userAvatar"
          alt="Users avatar"
          src={user ? user.avatar : null}
          sx={{ width: 60, height: 60 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography id="userName" variant="h4">
            Hello {user && user.name}
          </Typography>
        }
        secondary={
          <Typography variant="subtitle2">
            You have 42 notifications across 7 groups
          </Typography>
        }
      />
    </ListItem>
  );
};

export default UserIntroduction;
