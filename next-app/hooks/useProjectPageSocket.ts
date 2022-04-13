import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { connect, Socket } from "socket.io-client";

const useProjectPageSocket = (projectId: string) => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  const queryClient = useQueryClient();

  useEffect((): any => {
    socket = connect({
      path: "/api/socketio",
    });
    // log socket connection
    socket.on("connect", () => {
      socket.emit("joinRoom", "projectRoom:" + projectId);
    });
    // update chat on new message dispatched
    socket.on("refresh", (data) => {
      queryClient.setQueryData("project", data);
    });
    // // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);
};

export default useProjectPageSocket;
