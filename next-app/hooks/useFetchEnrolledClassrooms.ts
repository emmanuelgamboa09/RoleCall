import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Classroom } from "../interfaces/classroom.interface";
import { setEnrolledClassroms } from "../redux/slice/classroomslice";
import { selectEnrolledClassroooms } from "../redux/store";

export default function useFetchEnrolledClassrooms() {
  const dispatch = useDispatch();
  const enrolledClassrooms = useSelector(selectEnrolledClassroooms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const updateTaughtClassrooms = (
    taughtClassrooms: Array<Classroom>,
    error: boolean = false,
  ) => {
    setError(error);
    dispatch(setEnrolledClassroms(taughtClassrooms));
    setLoading(false);
  };

  useEffect(() => {
    fetch("api/classrooms", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        res
          .json()
          .then((classes) => {
            const { classrooms: taughtClassrooms } = classes;
            updateTaughtClassrooms(taughtClassrooms ? taughtClassrooms : []);
          })
          .catch(() => {
            updateTaughtClassrooms([], true);
          });
      })
      .catch(() => {
        updateTaughtClassrooms([], true);
      });
  }, []);
  return { enrolledClassrooms, loading, error };
}
