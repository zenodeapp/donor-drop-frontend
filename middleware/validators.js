
const cors = (origin, allowedOrigins) => {
  if (process.env.NODE_ENV !== "production") return { success: true };
  return { success: allowedOrigins.includes(origin) };
}

const method = (method, allowedMethods) => {
  return { success: allowedMethods.includes(method) }
}

export { cors, method };