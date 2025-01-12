import limiter from "./limiter";
import { cors, method } from "./validators";

const middleware = (req, res, allowedMethods, useValidations) => {
  // CORS validation
  if (useValidations.includes("cors")) {
    const origin =
      req.headers.origin ||
      (req.headers.referer && new URL(req.headers.referer).origin);
    const corsValidation = cors(origin, [process.env.NEXT_PUBLIC_SITE_URL]);
    if (!corsValidation.success)
      return res.status(403).json({ error: "Access denied" });
  }

  // Method validation
  if (useValidations.includes("method")) {
    const methodValidation = method(req.method, allowedMethods);
    if (!methodValidation.success) {
      res.setHeader("Allow", allowedMethods);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

  if (useValidations.includes("limiter")) {
    // Get ip address for limiter
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!ip)
      return res.status(400).json({ error: "Unable to determine client IP" });

    // Limiter validation
    const limiterValidation = limiter(ip);
    if (!limiterValidation.success) {
      res.setHeader("Retry-After", limiterValidation.retryAfter);
      return res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
    }
  }
};

export default function withMiddleware(
  handler,
  allowedMethods = ["GET"],
  useValidations = ["cors", "method", "limiter"]
) {
  return async (req, res) => {
    try {
      middleware(req, res, allowedMethods, useValidations);
      await handler(req, res);
    } catch (err) {
      console.error("Error in middleware or handler:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
