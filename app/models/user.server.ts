import type { Models } from "appwrite";
import { ID, AppwriteException } from "appwrite";
import type { Payload } from "./config.server";
import { account, appwriteEndpoint, call } from "./config.server";

export interface User extends Models.Account<Models.Preferences> {}

export async function createUser(email: string, password: string) {
  const user = await account.create(ID.unique(), email, password);
  return user;
}

export async function getProfileById(id: string) {
  try {
    const data = await account.getPrefs();
    return data;
  } catch (error) {
    console.error(error);
    if (error) return null;
  }
}

/** Below copied from Appwrite, and modified for serverside */

/**
 * Create Account Session with Email
 *
 * Allow the user to login into their account by providing a valid email and
 * password combination. This route will create a new session for the user.
 *
 * @param {string} email
 * @param {string} password
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function createEmailSession(
  email: string,
  password: string,
  headers = new Headers()
): Promise<{ response: Response; data: Models.Session }> {
  if (typeof email === "undefined") {
    throw new AppwriteException('Missing required parameter: "email"');
  }

  if (typeof password === "undefined") {
    throw new AppwriteException('Missing required parameter: "password"');
  }

  let path = "/account/sessions/email";
  let payload: Payload = {};

  if (typeof email !== "undefined") {
    payload["email"] = email;
  }

  if (typeof password !== "undefined") {
    payload["password"] = password;
  }
  headers.set("content-type","application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "post",
    uri,
    headers,
    payload
  );
}

/**
 * Get Account
 *
 * Get currently logged in user data as JSON object.
 *
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function getAccount<Preferences extends Models.Preferences>(
  headers: Headers
): Promise<{ response: Response; data: Models.Account<Preferences> }> {
  let path = "/account";
  let payload: Payload = {};

  headers.set("content-type","application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "get",
    uri,
    headers,
    payload
  );
}
