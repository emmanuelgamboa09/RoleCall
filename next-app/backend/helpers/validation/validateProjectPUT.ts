import Joi from "joi";
import {
  MAX_CLASSROOM_SIZE,
  MAX_PROJECT_DESCRIPTION_LENGTH,
} from "../../constants";

const schema = {
  projectId: Joi.string().required(),
  classroomId: Joi.string().required(),
  title: Joi.string().min(2).max(30),
  description: Joi.string().max(MAX_PROJECT_DESCRIPTION_LENGTH).allow(""),
  minTeamSize: Joi.number().min(1).max(MAX_CLASSROOM_SIZE),
  maxTeamSize: Joi.number().min(1).max(MAX_CLASSROOM_SIZE),
  formationDeadline: Joi.date().greater(new Date(Date.now() + 1000 * 60)),
};

export default (input: { [key: string]: any }) => {
  const validated = Joi.object(schema).validate(input);
  const { minTeamSize, maxTeamSize } = input;
  if (
    !validated.error &&
    minTeamSize !== undefined &&
    maxTeamSize !== undefined &&
    minTeamSize > maxTeamSize
  ) {
    return {
      ...validated,
      error: {
        details: [
          {
            context: {
              key: "minTeamSize",
              label: "minTeamSize",
              value: minTeamSize,
            },
            message:
              "Minimum group size must be less than or equal to maximum group size",
            path: ["groupSize"],
            type: "",
          },
        ],
      },
    };
  }

  return validated;
};

export const validateProjectUpdate = (input: { [key: string]: any }) => {
  return Joi.object(schema).validate(input);
};
