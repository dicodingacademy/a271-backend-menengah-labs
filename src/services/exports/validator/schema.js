import Joi from 'joi';

export const exportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
