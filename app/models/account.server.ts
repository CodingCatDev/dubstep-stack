import type { Models } from "appwrite";
import { ID, AppwriteException } from "appwrite";
import type { Payload } from "./appwrite.server";
import { appwriteEndpoint, call } from "./appwrite.server";

export interface User extends Models.Account<Models.Preferences> {}

export async function createUser(email: string, password: string) {
  const {data:user} = await create(ID.unique(), email, password);
  return user;
}

/** Below copied from Appwrite, and modified for serverside */

 /**
         * Create Account
         *
         * Use this endpoint to allow a new user to register a new account in your
         * project. After the user registration completes successfully, you can use
         * the [/account/verfication](/docs/client/account#accountCreateVerification)
         * route to start verifying the user email address. To allow the new user to
         * login to their new account, you need to create a new [account
         * session](/docs/client/account#accountCreateSession).
         *
         * @param {string} userId
         * @param {string} email
         * @param {string} password
         * @param {string} name
         * @throws {AppwriteException}
         * @returns {Promise}
         */
  export async function create<Preferences extends Models.Preferences>(userId: string, email: string, password: string, name?: string,  headers = new Headers()
  ): 
  Promise<{response:Response, data:Models.Account<Preferences>}> {
    if (typeof userId === 'undefined') {
        throw new AppwriteException('Missing required parameter: "userId"');
    }

    if (typeof email === 'undefined') {
        throw new AppwriteException('Missing required parameter: "email"');
    }

    if (typeof password === 'undefined') {
        throw new AppwriteException('Missing required parameter: "password"');
    }

    let path = '/account';
    let payload: Payload = {};

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }

    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }

    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    headers.set("content-type", "application/json");

    const uri = new URL(appwriteEndpoint + path);
    return await call('post', uri, headers, payload);
}

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
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call("post", uri, headers, payload);
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
  headers = new Headers()
): Promise<{ response: Response; data: Models.Account<Preferences> }> {
  let path = "/account";
  let payload: Payload = {};

  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call("get", uri, headers, payload);
}

/**
 * Delete Account Session
 *
 * Use this endpoint to log out the currently logged in user from all their
 * account sessions across all of their different devices. When using the
 * Session ID argument, only the unique session ID provided is deleted.
 *
 *
 * @param {string} sessionId
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function deleteSession(
  sessionId: string,
  headers = new Headers()
): Promise<{response: Response}> {
  if (typeof sessionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "sessionId"');
  }

  let path = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
  let payload: Payload = {};
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call("delete", uri, headers, payload);
}
