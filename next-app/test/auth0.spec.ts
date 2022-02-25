import { expect, test } from "@jest/globals";
import axios from "axios";
import {
  AUTH0_TEST_USER_EMAIL,
  AUTH0_TEST_USER_PWD,
} from "../backend/constants";

test("Authenticate with auth0 server using app and test user credentials", async () => {
  if (
    [process.env.AUTH0_CLIENT_ID, process.env.AUTH0_CLIENT_SECRET].some(
      (val) => val === undefined,
    )
  ) {
    throw new Error("Undefined auth0 ENV vars");
  }

  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("scope", "read:sample");
  formData.append("username", AUTH0_TEST_USER_EMAIL!);
  formData.append("password", AUTH0_TEST_USER_PWD!);
  formData.append("client_id", process.env.AUTH0_CLIENT_ID!);
  formData.append("client_secret", process.env.AUTH0_CLIENT_SECRET!);

  await axios
    .request({
      url: "https://dev-sl3do95f.auth0.com/oauth/token",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: formData,
    })
    .then(function (response) {
      expect(response).toBeTruthy();
    })
    .catch(function (error) {
      throw new Error(error);
    });
});
