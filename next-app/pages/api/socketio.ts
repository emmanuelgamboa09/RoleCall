import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "./types";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { socket } = res as NextApiResponseServerIO;
    if (!socket.server.io) {
      console.log("New Socket.io server...");
      // adapt Next's net Server to http Server
      const httpServer: NetServer = socket.server as any;
      const io = new ServerIO(httpServer, {
        path: "/api/socketio",
      });

      io.sockets.on("connection", function (socket) {
        socket.on("joinRoom", (room) => {
          socket.join(room);
        });
      });
      // append SocketIO server to Next.js socket server response
      socket.server.io = io;
    }
    res.end();
  },
);
