import crypto from "crypto";
import { CspConnectSource } from "../layout.config";

const isProd = process.env.NODE_ENV === "production";

const getCsp = (inlineScriptSource?: crypto.BinaryLike) => {
  const csp = [];

  csp.push(`base-uri 'none'`);
  csp.push(`form-action 'self'`);
  csp.push(`default-src 'self'`);

  let scriptSrc = `script-src 'self'${isProd ? "" : ` 'unsafe-eval'`}`;
  if (inlineScriptSource) {
    const hash = crypto.createHash("sha256").update(inlineScriptSource);
    scriptSrc = `${scriptSrc} 'sha256-${hash.digest("base64")}'`;
  }

  csp.push(scriptSrc);
  csp.push(`style-src 'self' 'unsafe-inline'`);
  csp.push(
    `connect-src 'self' vitals.vercel-insights.com${
      CspConnectSource ? ` ${CspConnectSource}` : ""
    }`
  );
  csp.push(`img-src 'self' data:`);
  csp.push(`font-src 'self' fonts.gstatic.com`);
  csp.push(`frame-src *`);
  csp.push(`media-src *`);

  return csp.join("; ");
};

export { getCsp };
