import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import getProfileByAuthId, { Data, ErrorMessage } from "../../../api/user/profile/getProfileByAuthId";
import {
    AUTH0_TEST_ID,
    AUTH0_TEST_USER_NAME,
    DB_TEST_NAME
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { UserModel } from "../../../database/models/user";

const authId = AUTH0_TEST_ID

beforeAll(async () => {
    await dbConnect(DB_TEST_NAME);

    const doc = new UserModel({
        authId,
        name: AUTH0_TEST_USER_NAME,
    });
    await doc.save();
});

afterAll(async () => {
    await UserModel.deleteOne({ authId });
    await dbDisconnect();
});

test("gets a user's profile by authId", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data | ErrorMessage>>({ method: "GET" });
    req.query = { authId }

    await getProfileByAuthId(req, res);
    const { profile } = JSON.parse(res._getData()) as Data;

    expect(res._getStatusCode()).toBe(200);
    expect(profile.name).toEqual(AUTH0_TEST_USER_NAME);

});

test("excludes _id & authId fields from the profile", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data | ErrorMessage>>({ method: "GET" });
    req.query = { authId }

    await getProfileByAuthId(req, res);
    const { profile } = JSON.parse(res._getData()) as Data;

    expect(profile).not.toHaveProperty("_id")
    expect(profile).not.toHaveProperty("authId")
});

test("fails to get a profile through an invalid authId", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data | ErrorMessage>>({ method: "GET" });
    req.query = { authId: "shouldn't-exist" }

    await getProfileByAuthId(req, res);

    expect(res._getStatusCode()).not.toBe(200);
});