import { Box, Chip, Stack, Typography } from "@mui/material";
import useTeam from "../../../hooks/useTeam";
import { SmDownCard } from "../../misc/cards/SmDownCard";
import ReadMoreText from "../../ReadMoreText";

export type MyTeamProps = {
  myTeam: ReturnType<typeof useTeam>;
};

const MyTeam = ({ myTeam: { teamProjectUsers } }: MyTeamProps) => {
  return (
    <Box>
      <Typography component="h2" fontSize="32px">
        My Team
      </Typography>
      <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: "1rem" }}>
        {teamProjectUsers.map(
          (
            { name = "MISSING_NAME", desiredRoles = [], projectBio = "" },
            index,
          ) => {
            return (
              <SmDownCard
                key={index}
                sx={{
                  width: 277,
                  height: "200px",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Box>
                    <Typography component="body" fontSize="24px">
                      {name}
                    </Typography>

                    <ReadMoreText
                      title={`Project Bio: ${name}`}
                      content={projectBio}
                      cutoffLength={50}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      maxWidth: "100%",
                      overflowX: "auto",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {desiredRoles.map((role) => (
                      <Chip label={role} />
                    ))}
                  </Stack>
                </Stack>
              </SmDownCard>
            );
          },
        )}
      </Stack>
    </Box>
  );
};

export default MyTeam;
