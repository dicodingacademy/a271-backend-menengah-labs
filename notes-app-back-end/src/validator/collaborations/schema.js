const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  noteId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
