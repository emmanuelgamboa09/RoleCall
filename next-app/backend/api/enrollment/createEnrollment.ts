import { FilterQuery, Query, QueryOptions, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { MAX_CLASSROOM_SIZE } from "../../constants";
import validateEnrollmentPUT from "../../helpers/validation/validateEnrollmentPUT";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  joinClassroom: (
    filter: FilterQuery<Classroom>,
    update: UpdateQuery<any>,
    options: QueryOptions,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
) => {
  const { body } = req;
  const { accessCode } = body;

  const { error } = validateEnrollmentPUT(body);
  if (error) {
    res.status(400).end(error?.message);
    return;
  }

  const sizeFilterKey = `students.${MAX_CLASSROOM_SIZE - 1}`;
  const filter = {
    _id: accessCode,
    instructorId: { $ne: authId },
    endDate: { $gt: new Date() },
    students: { $ne: authId },
    [sizeFilterKey]: { $exists: false },
  };

  const update = { $push: { students: authId } };
  try {
    const classroom = await joinClassroom(filter, update, {
      new: true,
    });
    if (!classroom) {
      res.status(400).end("Error joining classroom");
      return;
    }
    res.status(200).json(classroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
