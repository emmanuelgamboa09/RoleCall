import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../interfaces/classroom.interface";
import getProjection from "../helpers/getProjection";
import validateClassroomGET from "../helpers/validateClassroomGET";
import validateClassroomPOST from "../helpers/validateClassroomPOST";
import validateSingleClassroomGET from "../helpers/validateSingleClassroomGET";

export const createClassroom = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (classroom: Classroom) => Promise<void>,
) => {
  const body: Classroom = req.body;
  const { error } = validateClassroomPOST(body);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  const { title, endDate, students = [] } = body;
  const classroom = {
    instructorId: authId,
    title,
    endDate,
    students,
  };

  try {
    await save(classroom);
    res.status(200).json(classroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};

export const getClassrooms = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassrooms: (
    filter: FilterQuery<Classroom>,
  ) => Query<any, any, any, any> | Promise<Classroom[]>,
) => {
  const { query } = req;
  const { taught } = query;

  const { error } = validateClassroomGET(query);
  if (error) {
    console.log(error.message);
    res.status(400).end(error?.message);
    return;
  }

  const filter: { [k: string]: any } = {
    endDate: { $gte: new Date() },
  };

  if (taught) {
    filter.instructorId = authId;
  }

  try {
    const classrooms = await findClassrooms(filter);
    res.status(200).json({ classrooms });
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};

export const getClassroom = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassroom: (
    id: any,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
) => {
  const { query } = req;
  const { error } = validateSingleClassroomGET(query);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  const { classId, fields } = query;

  try {
    const classroom: Classroom = await findClassroom(classId);
    const { instructorId, students } = classroom || {};
    if (!classroom) {
      res.status(404).end("Class doesn't exist");
    } else if (instructorId !== authId && !students!.includes(authId)) {
      res.status(403).end("Forbidden");
    } else {
      res.status(200).json(getProjection(fields, classroom));
    }
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
