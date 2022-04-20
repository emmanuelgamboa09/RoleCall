import { Team } from "../database/models/project/teamSchema";

// Calculate if merging would create a team closer to upper constraint vs lower
const mergeWorks = (
  sortedTeams: Team[],
  minTeamSize: number,
  maxTeamSize: number,
) => {
  if (sortedTeams.length <= 1) return false;

  const { teamMembers: firstTeamMembers }: Team = sortedTeams[0];
  const { teamMembers: secondTeamMembers }: Team = sortedTeams[1];

  return (
    firstTeamMembers!.length < minTeamSize &&
    firstTeamMembers!.concat(secondTeamMembers!).length - maxTeamSize <=
      minTeamSize - firstTeamMembers!.length
  );
};

export default (teams: Team[], minTeamSize: number, maxTeamSize: number) => {
  let sortedBySize = teams.sort(
    (a: Team, b: Team) => a.teamMembers!.length - b.teamMembers!.length,
  );

  // Join smallest teams as long as they're not too big
  while (mergeWorks(sortedBySize, minTeamSize, maxTeamSize)) {
    sortedBySize[0].teamMembers = sortedBySize[0].teamMembers?.concat(
      sortedBySize[1].teamMembers!,
    );
    sortedBySize[0].incomingTeamRequests = [];
    sortedBySize.splice(1, 1);
    // Re-sort after merging to maintain order
    sortedBySize = sortedBySize.sort(
      (a: Team, b: Team) => a.teamMembers!.length - b.teamMembers!.length,
    );
  }

  return sortedBySize;
};
