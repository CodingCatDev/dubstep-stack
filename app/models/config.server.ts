import invariant from "tiny-invariant";
import { Client, Users, Databases } from "node-appwrite";

// Abstract this away
const appwriteEndpoint = process.env.APPWRITE_ENDPOINT as string;
const appwriteProject = process.env.APPWRITE_PROJECT as string;
const appwriteKey = process.env.APPWRITE_KEY as string;

export const appwriteDb = process.env.APPWRITE_DB as string;

invariant(
  appwriteEndpoint,
  "APPWRITE_ENDPOINT must be set in your environment variables."
);
invariant(
  appwriteProject,
  "APPWRITE_PROJECT must be set in your environment variables."
);
invariant(
  appwriteKey,
  "APPWRITE_KEY must be set in your environment variables."
);
invariant(appwriteDb, "APPWRITE_DB must be set in your environment variables.");

export const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProject)
  .setKey(appwriteKey);

export const users = new Users(client);
export const databases = new Databases(client);