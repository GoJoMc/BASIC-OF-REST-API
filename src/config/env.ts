const MONGO_URL = process.env["MONGO_URL"];
const JWT_SECRET = process.env["JWT_SECRET"];
const PORT = process.env["PORT"];

if (!JWT_SECRET) {
  throw new Error("Where is the JWT SECRET huh???");
}

if (!MONGO_URL) {
  throw new Error("Where is The Mongo Url");
}

if (!PORT) {
  throw new Error("Where is The PORT huh??");
}

export const env = {
  JWT_SECRET,
  MONGO_URL,
  PORT: Number(PORT),
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
};
