import { ReactNode, useState, MouseEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "../components/navbar/HomeAppBar";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FC } from "react";
import theme from "../src/theme";
import OnboardingDialog from "../components/onboarding/onboardingdialog";
import useOnboardUserChecker from "../hooks/useOnboardUserChecker";
import { useUser } from "@auth0/nextjs-auth0";

interface homeDrawerOptionInterface {
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  pathname: string;
}

const options: Array<homeDrawerOptionInterface> = [
  { text: "Home", Icon: HomeIcon, pathname: "/app" },
  { text: "Logout", Icon: LogoutIcon, pathname: "/api/auth/logout" },
];

type HomeLayoutProps = {
  children: ReactNode;
  title?: string;
};

const BaseAppLayout: FC<HomeLayoutProps> = ({ children, title }) => {
  const { user } = useUser();
  const onboardUser = useOnboardUserChecker();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              ROLECALL
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {options.map((drawerOption) => (
                <Link
                  href={{ pathname: drawerOption.pathname }}
                  key={drawerOption.text}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {drawerOption.text}
                  </Button>
                </Link>
              ))}
            </Box>
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
                {options.map((drawerOption) => (
                  <Link
                    href={{ pathname: drawerOption.pathname }}
                    key={drawerOption.text}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        {drawerOption.text}
                      </Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: { xs: "flex-end" },
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {user?.name && (
                <Typography fontSize="16px" component="text">
                  User: {user?.name}
                </Typography>
              )}
              <Typography variant="h6" noWrap component="div">
                {title}
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box px={2} sx={{ backgroundColor: theme.palette.secondary.main }}>
        {children}
      </Box>
      {onboardUser && <OnboardingDialog />}
    </Box>
  );
};

export default BaseAppLayout;
