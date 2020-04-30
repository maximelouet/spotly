const exchangeCodeSchema = {
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: {
        type: 'string',
        minLength: 10,
      },
    },
  },
};

const refreshTokenSchema = {
  body: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        minLength: 10,
      },
    },
  },
};

const loggedInSchema = {
  body: {
    type: 'object',
    required: ['accessToken'],
    properties: {
      accessToken: {
        type: 'string',
        minLength: 10,
      },
    },
  },
};

export {
  exchangeCodeSchema,
  refreshTokenSchema,
  loggedInSchema,
};
