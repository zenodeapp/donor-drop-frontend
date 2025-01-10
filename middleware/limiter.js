// Globally defined rate limiter does mean we limit a user solely on ip (shared across endpoints)
// TODO: perhaps we should make the limiter endpoint specific.
const limiterMap = new Map();

// Cleanup variables (see below)
let cleanupPending = false;
const cleanupAtSize = 10000;
const cleanupStaleThresholdMs = 5 * 60 * 1000;

const createLimiter = ({ windowMs, maxCalls }) => {
  return (ip) => {
    const now = Date.now();
    const resetTime = now + windowMs;

    // if this is the first time we see this ip, add it.
    if (!limiterMap.has(ip)) {
      addToLimiterMap(ip, { calls: 1, resetTime, lastActive: now });
      return { success: true };
    }

    // Get client
    const client = limiterMap.get(ip);
    
    // reset the user's rate limit if the window has passed
    if (now > client.resetTime) {
      addToLimiterMap(ip, { calls: 1, resetTime, lastActive: now});
      return { success: true };
    }

    // Increment the request count
    if (client.calls < maxCalls) {
      client.calls += 1;
      return { success: true };
    }

    // If we got here, the request should get blocked, also return a retryAfter value for the header
    return { success: false, retryAfter: Math.ceil((client.resetTime - now) / 1000) };
  };
}

const addToLimiterMap = (ip, entry) => {
  limiterMap.set(ip, entry);
  
  // This will attempt to clean up the map in case the mapping grows too big.
  tryMapCleanup();
}

const tryMapCleanup = () => {
  if (!cleanupPending && limiterMap.size > cleanupAtSize) {
    cleanupPending = true;
    
    console.log("Performing cleanup of limiter map.");
    const now = Date.now();
    let count = 0;

    for (const [ip, entry] of limiterMap.entries()) {
      if (now - entry.lastActive > cleanupStaleThresholdMs) {
        limiterMap.delete(ip);
        count++;
      }
    }

    console.log(`Removed ${count} IP addresses due to inactivity.`);
    cleanupPending = false;
  }
};

const limiter = createLimiter({
  windowMs: (process.env.RATE_LIMIT_WINDOW_IN_SEC || 60) * 1000,
  maxCalls: process.env.RATE_LIMIT_MAX_CALLS || 60,
});

export default limiter;