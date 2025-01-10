
import limiter from "./limiter";
import { cors, method } from "./validators";

const middleware = (req, res, allowedMethods = ["GET"]) => {
  // CORS validation
  const corsValidation = cors(req.headers.origin, [process.env.NEXT_PUBLIC_SITE_URL]);
  if(!corsValidation.success)
    return res.status(403).json({ error: "Access denied" });

  // Method validation
  const methodValidation = method(req.method, allowedMethods);
  if (!methodValidation.success) {
    res.setHeader("Allow", allowedMethods);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get ip address for limiter
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!ip)
    return res.status(400).json({ error: "Unable to determine client IP" });

  // Limiter validation
  const limiterValidation = limiter(ip);
  if (!limiterValidation.success) {
    res.setHeader("Retry-After", limiterValidation.retryAfter);
    return res.status(429).json({ error: "Too many requests, please try again later." });
  }
}

export default function withMiddleware(handler, allowedMethods = ["GET"]) {
  return async (req, res) => {
    try {
      middleware(req, res, allowedMethods);
      await handler(req, res);
    } catch (err) {
      console.error("Error in middleware or handler:", err);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
