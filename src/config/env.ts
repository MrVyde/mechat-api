const rawJwtSecret = process.env.JWT_SECRET;
const rawDemoUsername = process.env.DEMO_USERNAME;
const rawFrontendUrl = process.env.FRONTEND_URL;
const rawFrontendProdUrl = process.env.FRONTEND_PROD_URL;

if (!rawJwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

if (!rawDemoUsername) {
  throw new Error("DEMO_USERNAME is not defined");
}

if (!rawFrontendUrl) {
  throw new Error("FRONTEND_URL is not defined");
}

if (!rawFrontendProdUrl) {
  throw new Error("FRONTEND_PROD_URL is not defined");
}

export const JWT_SECRET = rawJwtSecret;
export const DEMO_USERNAME = rawDemoUsername;
export const FRONTEND_URL = rawFrontendUrl;
export const FRONTEND_PROD_URL = rawFrontendProdUrl;
