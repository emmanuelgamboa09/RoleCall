import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "../components/navbar/HomeAppBar";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FC } from "react";
import theme from "../src/theme";
import OnboardingDialog from "../components/onboarding/onboardingdialog";
import useOnboardUserChecker from "../hooks/useOnboardUserChecker";

const drawerWidth = 240;

interface homeDrawerOptionInterface {
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  pathname: string;
}

// Will refactor how this is implementented in a later pr
const drawerOptions: Array<homeDrawerOptionInterface> = [
  { text: "Home", Icon: HomeIcon, pathname: "/app" },
  { text: "Logout", Icon: LogoutIcon, pathname: "/api/auth/logout" },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type HomeLayoutProps = {
  children: ReactNode;
  title?: string;
};

const BaseAppLayout: FC<HomeLayoutProps> = ({ children, title }) => {
  const [open, setOpen] = useState(false);
  const onboardUser = useOnboardUserChecker();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerOptions.map((drawerOption) => (
            <Link
              href={{ pathname: drawerOption.pathname }}
              key={drawerOption.text}
            >
              <ListItem button>
                <ListItemIcon>
                  <drawerOption.Icon />
                </ListItemIcon>
                <ListItemText primary={drawerOption.text} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box
        width={"100vw"}
        px={2}
        sx={{ backgroundColor: theme.palette.secondary.main }}
      >
        <DrawerHeader />
        {children}
      </Box>
      {onboardUser && <OnboardingDialog />}
    </Box>
  );
};

export default BaseAppLayout;
