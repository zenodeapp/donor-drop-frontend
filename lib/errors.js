const ERROR_MESSAGES = {
  INVALID_TIMESTAMP: "The timestamp provided in the message is invalid.",
  SIGNATURE_EXPIRED: "The signature has expired. Please try again.",
  VERIFICATION_FAILED: "The signature verification failed.",
};

class WhitelistedError extends Error {
  constructor(type) {
    super(ERROR_MESSAGES[type]);
    this.type = type;
  }
}

module.exports = { ERROR_MESSAGES, WhitelistedError };
