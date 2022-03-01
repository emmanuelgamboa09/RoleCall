import { Classroom } from "../../interfaces/classroom.interface";

// Takes projection query parameter and classroom document
// Returns document with projected fields
export default (
  fieldParam: string | undefined | string[],
  classroom: Classroom | { [key: string]: any },
) => {
  if (fieldParam === undefined) {
    return classroom;
  }

  const fields = (fieldParam as string).split(",");
  const projection: {
    [key: string]: any;
  } = {};
  for (const field of fields) {
    projection[field] = classroom[field as keyof Classroom];
  }
  return projection;
};
