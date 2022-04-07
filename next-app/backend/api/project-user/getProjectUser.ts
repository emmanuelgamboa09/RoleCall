import { Error as MongooseError } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { ClassroomModel } from "../../database/models/classroom";
import { Project } from "../../database/models/project";
import { UserProjectProfile } from "../../database/models/project/userProjectProfileSchema";
import { FindById } from "../../types";
import { UserModel } from "./../../database/models/user";

export type Data =
  | Omit<
      UserProjectProfile,
      "_id" | "studentId" | "incomingTeamRequests" | "outgoingTeamRequests"
    >
  | {
      message:
        | "not-created"
        | "server-error"
        | "invalid-request"
        | "not-authorized";
    };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findProject: FindById<Project>,
) => {
  try {
    const { query } = req;
    const { profileId, projectId } = query as {
      profileId?: string;
      projectId?: string;
    };

    if (!profileId) throw new Error("profileId not specified");
    if (!projectId) throw new Error("projectId not specified");

    const project: Project = await findProject(projectId);
    if (!project) throw new Error("Invalid project request");

    const user = await UserModel.findOne({ authId: profileId });
    if (!user) throw new Error("Failed to find user");

    const profile = project.projectUsers?.find(
      (user) => user.studentId === profileId,
    );
    if (!profile) return res.status(200).json({ message: "not-created" });

    const isViewerInstructor = await ClassroomModel.exists({
      _id: project.classroomId,
      instructorId: authId,
    });

    const isViewerProjectUser = project.projectUsers.some(
      (pu) => pu.studentId === authId,
    );

    console.log(isViewerInstructor, isViewerProjectUser);

    if (!isViewerInstructor && !isViewerProjectUser) {
      return res.json({ message: "not-authorized" });
    }

    const { desiredRoles, projectBio } = profile;

    return res.status(200).json({ desiredRoles, projectBio });
  } catch (e) {
    console.log(e);

    if (e instanceof MongooseError) {
      res.status(500).json({ message: "server-error" });
    }
    return res.status(400).json({ message: "invalid-request" });
  }
};
