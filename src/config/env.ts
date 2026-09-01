//with this if i forgot to set the environment variable(.env), process.env.JWT_SECRET would be undefined.
//Node automatically gives you access to environment variables through process.env. no need to import it
//This check makes the app fail immediately with a clear error, 
// instead of silently running with no secret (which would break JWT verification and be insecure).
const rawJwtSecret = process.env.JWT_SECRET;
const rawDemoUsername = process.env.DEMO_USERNAME;

if (!rawJwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

if (!rawDemoUsername) {
  throw new Error("DEMO_USERNAME is not defined");
}

export const JWT_SECRET = rawJwtSecret;
export const DEMO_USERNAME = rawDemoUsername;