import React, { FC } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import useMe from "../../hooks/useMe";

interface UserIntroductionProps {}

const UserIntroduction: FC<UserIntroductionProps> = () => {
  const me = useMe();
  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemAvatar>
        <Avatar
          id="userAvatar"
          alt="Users avatar"
          src={me ? me.avatar : null}
          sx={{ width: 60, height: 60 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography id="userName" variant="h4">
            Hello {me && me.name}
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
