import { STATUS_CODES } from "../constants/status.js";

export const sendResponse = (res, { success, message, data, status }) => {
  res.status(status || STATUS_CODES.SUCCESS).json({
    success,
    message,
    data: data || null,
  });
};
