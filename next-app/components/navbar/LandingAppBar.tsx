import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import React, { FC, ReactElement } from "react";
import theme from "../../src/theme";
import NavOptions, { NavOption } from "./NavOptions";

const navOptions: Array<NavOption> = [
  { text: "Login", route: "/api/auth/login", show: "logged-out-only" },
  { text: "Sign up", route: "/api/auth/login", show: "logged-out-only" },
  { text: "Sign out", route: "/api/auth/logout", show: "login-only" },
  { text: "Learn More", route: "", show: "always" },
];

interface LandingAppBarProps {}

const LandingAppBar: FC<LandingAppBarProps> = (): ReactElement => {
  const router = useRouter();
  const navigate = (route: string) => {
    return () => {
      router.push(route);
      handleCloseNavMenu();
    };
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            alignItems: "left",
          }}
        >
          ROLECALL
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <NavOptions
              options={navOptions}
              render={({ text, route }) => (
                <MenuItem
                  style={{ color: theme.palette.text.secondary }}
                  key={text}
                  onClick={navigate(route)}
                >
                  <Typography textAlign="center">{text}</Typography>
                </MenuItem>
              )}
            />
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <NavOptions
            options={navOptions}
            render={({ text, route }) => (
              <Button
                key={text}
                onClick={navigate(route)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {text}
              </Button>
            )}
          />
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            LOGO
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingAppBar;
