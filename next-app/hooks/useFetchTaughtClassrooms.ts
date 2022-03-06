import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Classroom } from "../interfaces/classroom.interface";
import { setTaughtClassrooms } from "../redux/slice/classroomslice";
import { selectTaughtClassrooms } from "../redux/store";

export default function useFetchTaughtClassrooms() {
  const dispatch = useDispatch();
  const taughtClassrooms = useSelector(selectTaughtClassrooms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const updateTaughtClassrooms = (
    taughtClassrooms: Array<Classroom>,
    error: boolean = false,
  ) => {
    setError(error);
    dispatch(setTaughtClassrooms(taughtClassrooms));
    setLoading(false);
  };

  useEffect(() => {
    fetch("api/classrooms?taught=true", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        res
          .json()
          .then((classes) => {
            const { classrooms } = classes;
            updateTaughtClassrooms(classrooms ? classrooms : []);
          })
          .catch(() => {
            updateTaughtClassrooms([], true);
          });
      })
      .catch(() => {
        updateTaughtClassrooms([], true);
      });
  }, []);

  return { taughtClassrooms, loading, error };
}
