import type { Models } from "appwrite";
import { AppwriteException, Payload } from "appwrite";
import {
  appwriteEndpoint,
  call,
} from "./appwrite.server";

/**
 * List Documents
 *
 * Get a list of all the user's documents in a given collection. You can use
 * the query params to filter your results. On admin mode, this endpoint will
 * return a list of all of documents belonging to the provided collectionId.
 * [Learn more about different API modes](/docs/admin).
 *
 * @param {string} databaseId
 * @param {string} collectionId
 * @param {string[]} queries
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function listDocuments<Document extends Models.Document>(
  databaseId: string,
  collectionId: string,
  queries?: string[],
  headers = new Headers()
  ): Promise<{ response: Response; data: Models.DocumentList<Document> }> {
  if (typeof databaseId === "undefined") {
    throw new AppwriteException('Missing required parameter: "databaseId"');
  }

  if (typeof collectionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "collectionId"');
  }

  let path = "/databases/{databaseId}/collections/{collectionId}/documents"
    .replace("{databaseId}", databaseId)
    .replace("{collectionId}", collectionId);
  let payload: Payload = {};

  if (typeof queries !== "undefined") {
    payload["queries"] = queries;
  }
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call("get", uri, headers, payload);
}

/**
 * Create Document
 *
 * Create a new Document. Before using this route, you should create a new
 * collection resource using either a [server
 * integration](/docs/server/databases#databasesCreateCollection) API or
 * directly from your database console.
 *
 * @param {string} databaseId
 * @param {string} collectionId
 * @param {string} documentId
 * @param {Omit<Document, keyof Models.Document>} data
 * @param {string[]} permissions
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function createDocument<Document extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: Omit<Document, keyof Models.Document>,
  permissions?: string[],
  headers = new Headers()
): Promise<{response: Response; data: Document}> {
  if (typeof databaseId === "undefined") {
    throw new AppwriteException('Missing required parameter: "databaseId"');
  }

  if (typeof collectionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "collectionId"');
  }

  if (typeof documentId === "undefined") {
    throw new AppwriteException('Missing required parameter: "documentId"');
  }

  if (typeof data === "undefined") {
    throw new AppwriteException('Missing required parameter: "data"');
  }

  let path = "/databases/{databaseId}/collections/{collectionId}/documents"
    .replace("{databaseId}", databaseId)
    .replace("{collectionId}", collectionId);
  let payload: Payload = {};

  if (typeof documentId !== "undefined") {
    payload["documentId"] = documentId;
  }

  if (typeof data !== "undefined") {
    payload["data"] = data;
  }

  if (typeof permissions !== "undefined") {
    payload["permissions"] = permissions;
  }
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "post",
    uri,
    headers,
    payload
  );
}

/**
 * Get Document
 *
 * Get a document by its unique ID. This endpoint response returns a JSON
 * object with the document data.
 *
 * @param {string} databaseId
 * @param {string} collectionId
 * @param {string} documentId
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function getDocument<Document extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  headers = new Headers()
): Promise<{response: Response; data: Document}> {
  if (typeof databaseId === "undefined") {
    throw new AppwriteException('Missing required parameter: "databaseId"');
  }

  if (typeof collectionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "collectionId"');
  }

  if (typeof documentId === "undefined") {
    throw new AppwriteException('Missing required parameter: "documentId"');
  }

  let path =
    "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
      .replace("{databaseId}", databaseId)
      .replace("{collectionId}", collectionId)
      .replace("{documentId}", documentId);
  let payload: Payload = {};
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "get",
    uri,
    headers,
    payload
  );
}

/**
 * Update Document
 *
 * Update a document by its unique ID. Using the patch method you can pass
 * only specific fields that will get updated.
 *
 * @param {string} databaseId
 * @param {string} collectionId
 * @param {string} documentId
 * @param {Partial<Omit<Document, keyof Models.Document>>} data
 * @param {string[]} permissions
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function updateDocument<Document extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  data?: Partial<Omit<Document, keyof Models.Document>>,
  permissions?: string[],
  headers = new Headers()
): Promise<{response: Response; data: Document}> {
  if (typeof databaseId === "undefined") {
    throw new AppwriteException('Missing required parameter: "databaseId"');
  }

  if (typeof collectionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "collectionId"');
  }

  if (typeof documentId === "undefined") {
    throw new AppwriteException('Missing required parameter: "documentId"');
  }

  let path =
    "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
      .replace("{databaseId}", databaseId)
      .replace("{collectionId}", collectionId)
      .replace("{documentId}", documentId);
  let payload: Payload = {};

  if (typeof data !== "undefined") {
    payload["data"] = data;
  }

  if (typeof permissions !== "undefined") {
    payload["permissions"] = permissions;
  }
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "patch",
    uri,
    headers,
    payload
  );
}

/**
 * Delete Document
 *
 * Delete a document by its unique ID.
 *
 * @param {string} databaseId
 * @param {string} collectionId
 * @param {string} documentId
 * @throws {AppwriteException}
 * @returns {Promise}
 */
export async function deleteDocument(
  databaseId: string,
  collectionId: string,
  documentId: string,
  headers = new Headers()
): Promise<{response:Response}> {
  if (typeof databaseId === "undefined") {
    throw new AppwriteException('Missing required parameter: "databaseId"');
  }

  if (typeof collectionId === "undefined") {
    throw new AppwriteException('Missing required parameter: "collectionId"');
  }

  if (typeof documentId === "undefined") {
    throw new AppwriteException('Missing required parameter: "documentId"');
  }

  let path =
    "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
      .replace("{databaseId}", databaseId)
      .replace("{collectionId}", collectionId)
      .replace("{documentId}", documentId);
  let payload: Payload = {};
  headers.set("content-type", "application/json");

  const uri = new URL(appwriteEndpoint + path);
  return await call(
    "delete",
    uri,
    headers,
    payload
  );
}
