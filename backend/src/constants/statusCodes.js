// statusCodes.js

export const statusCode = {
  OK: { code: 200, message: "OK" },
  CREATED: { code: 201, message: "Created" },
  NO_CONTENT: { code: 204, message: "No Content" },
  BAD_REQUEST: { code: 400, message: "Bad Request" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  NOT_FOUND: { code: 404, message: "Not Found" },
  METHOD_NOT_ALLOWED: { code: 405, message: "Method Not Allowed" },
  CONFLICT: { code: 409, message: "Conflict" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
  NOT_IMPLEMENTED: { code: 501, message: "Not Implemented" },
  TOO_MANY_REQUESTS: { code: 429, message: "Too Many Requests" },
};