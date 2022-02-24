import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMe } from "../redux/slice/userslice";
import { selectMe } from "../redux/store";

export default function useInitializeMe() {
  const { user } = useUser();
  const me = useSelector(selectMe);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && me === null) {
      fetch("api/users/me", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      })
        .then(async (res) => {
          res
            .json()
            .then((user) => {
              dispatch(updateMe(user));
            })
            .catch((err) => {
              // Should setup a logger to logg errors in mongodb
              console.log("ERROR");
            });
        })
        .catch((err) => {
          console.log("ERROR");
        });
    }
  }, [user]);

  return me;
}
