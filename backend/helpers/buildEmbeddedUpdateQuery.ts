import { Project } from "../database/models/project";

export default (body: Partial<Project>) => {
  const reducer = (obj: { [key: string]: any }, field: string) => {
    const key = `projectUsers.$.${field}`;
    return { ...obj, [key]: body[field as keyof Project] };
  };
  const fieldUpdates = Object.keys(body).reduce(reducer, {});
  return { $set: { ...fieldUpdates } };
};
