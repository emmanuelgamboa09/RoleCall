import { Box, Container, Grid, Typography } from "@mui/material";
import { FC } from "react";
import theme from "../src/theme";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Link from "next/link";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <Box
      px={{ xs: 2, sm: 6 }}
      py={{ xs: 3, sm: 6 }}
      bgcolor={theme.palette.secondary.main}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" borderBottom={1} sx={{ mb: 1 }}>
              RoleCall
            </Typography>
            <Typography variant="body1">
              Create groups on the fly. Invite students to your classroom and
              form groups at the click of a button
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" borderBottom={1} sx={{ mb: 1 }}>
              Account
            </Typography>
            <Typography variant="body1">
              <Link href="/api/auth/login">Login / Register</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" borderBottom={1} sx={{ mb: 1 }}>
              More
            </Typography>
            <div>
              <TwitterIcon />
            </div>
            <div>
              <InstagramIcon />
            </div>
          </Grid>
        </Grid>
        <Box textAlign="center" pt={{ xs: 3, sm: 5 }}>
          Rolecall &reg; {new Date().getFullYear()}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
