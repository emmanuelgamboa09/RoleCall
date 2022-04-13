import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect } from "react";
import { connect, Socket } from "socket.io-client";

const useProjectPageSocket = (refetch: () => void, projectId: string) => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  useEffect((): any => {
    socket = connect({
      path: "/api/socketio",
    });
    // log socket connection
    socket.on("connect", () => {
      socket.emit("joinRoom", "projectRoom:" + projectId);
    });
    // update chat on new message dispatched
    socket.on("refresh", () => {
      refetch();
    });
    // // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);
};

export default useProjectPageSocket;
