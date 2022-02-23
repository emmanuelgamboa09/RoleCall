import { NextApiRequest, NextApiResponse } from "next";
import dbConnect, { dbDisconnect } from "../api/database/dbConnect";

export default (
  next: (request: NextApiRequest, response: NextApiResponse) => Promise<void>
) => {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    try {
      await dbConnect();
      return next(request, response);
    } catch (err) {
      await dbDisconnect();
      response.status(500).send("Internal Server Error");
    }
  };
};
