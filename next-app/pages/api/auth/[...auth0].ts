import { handleAuth } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { injectedLogin } from "../../../backend/helpers/login";
import withDb from "../../../backend/middleware/withDb";

export default handleAuth({
  callback: withDb(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await injectedLogin(req, res);
    } catch (error: any) {
      console.error(error);
    }
  }),
});
