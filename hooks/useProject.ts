import { useQuery, UseQueryOptions } from "react-query";
import { Data } from "../backend/api/project/getProject";

export type UseProjectOptions = {
  projectId: string;
  options?: UseQueryOptions<Data>;
};

export default function useProject({ projectId, options }: UseProjectOptions) {
  const query = useQuery<Data>(
    "project",
    () => fetch(`/api/projects/${projectId}`).then((res) => res.json()),
    options,
  );
  return query;
}
