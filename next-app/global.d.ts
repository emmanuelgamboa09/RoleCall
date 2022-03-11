import * as mongoose from "mongoose";
import { NextPage } from "next";

declare global {
  var mongooseInst: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {
      APP_ENV: undefined | "test"; // setting NODE_ENV=test will set this to "test"
      AUTH0_SECRET: string;
      AUTH0_BASE_URL: string;
      AUTH0_ISSUER_BASE_URL: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      DB_USER: string;
      DB_PWD: string;
    }
  }

  type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}

export {};
