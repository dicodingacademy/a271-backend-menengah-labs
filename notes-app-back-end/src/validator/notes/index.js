import { notePayloadSchema } from './schema.js';

const notesValidator = {
  validatePayload: (payload) => {
    const { error, value } = notePayloadSchema.validate(payload);

    if (error) {
      return { error };
    }

    return { value };
  },
};

export default notesValidator;


