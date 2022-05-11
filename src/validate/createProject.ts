import Joi from "joi";

const schema = {
  title: Joi.string().min(2).max(30).required(),
  description: Joi.string().max(512).allow(""),
  minTeamSize: Joi.string()
    .regex(/^[1-9][0-9]*$/)
    .max(3)
    .required(),
  maxTeamSize: Joi.string()
    .regex(/^[1-9][0-9]*$/)
    .max(3)
    .required(),
  formationDeadline: Joi.date()
    .greater(new Date(Date.now() + 1000 * 60))
    .required(),
};

export function validateCreateProjectForm(input: { [key: string]: any }) {
  const validated = Joi.object(schema).validate(input, { abortEarly: false });
  const { minTeamSize, maxTeamSize } = input;
  if (!validated.error && minTeamSize.localeCompare(maxTeamSize) > 0) {
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
}
