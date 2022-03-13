import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Options {
  getClassroom: (id: string) => Promise<Response>;
}

export default (
  { getClassroom }: Options = {
    getClassroom: (id: string) => fetch(`/api/classrooms/${id}`),
  },
) => {
  const [checkingUrl, setCheckingUrl] = useState(true);
  const router = useRouter();

  const { classroomId } = router.query;

  useEffect(() => {
    getClassroom(classroomId as string).then((res) => {
      if (res.ok) {
        setCheckingUrl(false);
      } else {
        router.push("/app");
      }
    });
  });

  return { checkingUrl };
};
