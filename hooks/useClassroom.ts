import { useQuery, UseQueryOptions } from "react-query";
import { Data } from "./../backend/api/classroom/getClassroom";

export type UseClassroomOptions = {
  classroomId: string;
  options?: UseQueryOptions<Data>;
};

export default function useClassroom({
  classroomId,
  options,
}: UseClassroomOptions) {
  const query = useQuery<Data>(
    "classroom",
    () => fetch(`/api/classrooms/${classroomId}`).then((res) => res.json()),
    options,
  );

  return query;
}
