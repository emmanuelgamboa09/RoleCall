import { UserProfile } from "@auth0/nextjs-auth0";
import { useQuery } from "react-query";
import { Data as GetProjectUserData } from "../backend/api/project-user/getProjectUser";
import { Project } from "../backend/database/models/project";

export type UseProjectUserOptions = {
  projectId: Project["_id"];
  userId?: UserProfile["sub"];
  enabled?: boolean;
};

export default function useProjectUser({
  projectId,
  userId,
  enabled = true,
}: UseProjectUserOptions) {
  const projectProfileData = useQuery<GetProjectUserData>(
    "project-profile",
    () =>
      fetch(`/api/project-users/${userId}?projectId=${projectId}`).then((res) =>
        res.json(),
      ),
    { enabled: enabled && Boolean(userId) },
  );

  const created = !(
    projectProfileData.data &&
    "message" in projectProfileData.data &&
    projectProfileData.data.message === "not-created"
  );
  console.log(projectProfileData.data);
  console.log(created);

  const isUserInvalid =
    projectProfileData.data &&
    "message" in projectProfileData.data &&
    (projectProfileData.data.message === "server-error" ||
      projectProfileData.data.message === "invalid-request");

  const notAuthorized =
    projectProfileData.data &&
    "message" in projectProfileData.data &&
    projectProfileData.data.message === "not-authorized";

  const userProfileData =
    projectProfileData.data && !("message" in projectProfileData.data)
      ? projectProfileData.data
      : null;

  return {
    shouldCreate: !created,
    loading: projectProfileData.isLoading,
    data: userProfileData,
    isUserInvalid,
    notAuthorized,
    error: projectProfileData.error,
    refetch: projectProfileData.refetch,
  };
}
