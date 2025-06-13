import ratelimit from "../config/upstash.js";
import { statusCode } from "../constants/statusCodes.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(statusCode.TOO_MANY_REQUESTS.code).json({
        message: statusCode.TOO_MANY_REQUESTS.message,
      });
    }

    next();
  } catch (error) {
    // Log do erro para depuração
    console.error("Erro no middleware de rate limiting:", error);
    next(error);
  }
}

export default rateLimiter;