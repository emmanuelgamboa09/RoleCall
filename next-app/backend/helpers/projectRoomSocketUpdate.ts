import { NextApiResponse } from "next";
import { NextApiResponseServerIO } from "../../pages/api/types";
import { Project } from "../database/models/project";

const projectRoomSocketUpdate = (
  res: NextApiResponse,
  projectId: string,
  project: Project,
) => {
  try {
    // Send back result which is the updated project.
    const { socket } = res as NextApiResponseServerIO;
    socket?.server?.io?.to("projectRoom:" + projectId).emit("refresh", project);
  } catch (e) {
    //If socket for some reason is unable to happen, just catch and continue
    console.log("Socket failed to send message");
  }
};

export default projectRoomSocketUpdate;
