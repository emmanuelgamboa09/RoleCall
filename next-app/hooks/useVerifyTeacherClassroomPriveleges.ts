import router from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Data as GetClassroomApiData } from "../backend/api/classroom/getClassroom";
import { selectMe } from "../redux/store";

export default function useVerifyTeacherPrivelegedRoutes(classroomId: string) {
  const [verified, setVerified] = useState(false);
  const me = useSelector(selectMe);
  const { isLoading, error, data } = useQuery<GetClassroomApiData>(
    "classroom",
    () => fetch(`/api/classrooms/${classroomId}`).then((res) => res.json()),
  );

  useEffect(() => {
    if (!isLoading && me !== null) {
      if (error || me?.authId !== data?.instructorId) {
        router.back();
      }
      setVerified(true);
    }
  }, [me, data, isLoading, error]);

  return verified;
}
