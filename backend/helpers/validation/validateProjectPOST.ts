import Joi from "joi";
import {
  MAX_CLASSROOM_SIZE,
  MAX_PROJECT_DESCRIPTION_LENGTH,
} from "../../constants";

const schema = {
  classroomId: Joi.string().required(),
  title: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(MAX_PROJECT_DESCRIPTION_LENGTH).allow(""),
  minTeamSize: Joi.number().min(1).max(MAX_CLASSROOM_SIZE).required(),
  maxTeamSize: Joi.number().min(1).max(MAX_CLASSROOM_SIZE).required(),
  groupsFinalized: Joi.boolean(),
  formationDeadline: Joi.date()
    .greater(new Date(Date.now() + 1000 * 60))
    .required(),
};

export default (input: { [key: string]: any }) => {
  const validated = Joi.object(schema).validate(input);
  const { minTeamSize, maxTeamSize } = input;
  if (!validated.error && minTeamSize > maxTeamSize) {
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
