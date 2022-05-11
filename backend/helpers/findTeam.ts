import { Project } from "../database/models/project";
import { Team } from "../database/models/project/teamSchema";

export default (project: Project, teamId: string) =>
  project.teams?.find((team: Team) => team._id?.toString() === teamId);
