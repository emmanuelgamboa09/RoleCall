import Joi from "joi";

const schema = {
  title: Joi.string().min(2).max(30).required(),
  minGroupSize: Joi.string()
    .regex(/^[1-9][0-9]*$/)
    .required(),
  maxGroupSize: Joi.string()
    .regex(/^[1-9][0-9]*$/)
    .required(),
  formationDeadline: Joi.date().greater(new Date(Date.now() + 1000 * 60)),
};

export function validateCreateProjectForm(input: { [key: string]: any }) {
  const validated = Joi.object(schema).validate(input, { abortEarly: false });

  if (
    !validated.error &&
    Number(input.minGroupSize) > Number(input.maxGroupSize)
  ) {
    return {
      ...validated,
      error: {
        details: [
          {
            context: {
              key: "minGroupSize",
              label: "minGroupSize",
              value: input.minGroupSize,
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
