import type { Models } from "appwrite";
import { Query, ID } from "appwrite";
import type { User } from "./account.server";
import { appwriteDb } from "./appwrite.server";
import {
  createDocument,
  deleteDocument,
  listDocuments,
} from "./databases.server";

export interface Note extends Models.Document {
  userId: string;
  id: string;
  title: string;
  body: string;
}

export async function getNoteListItems({
  userId,
  headers,
}: {
  userId: User["$id"];
  headers: Headers;
}) {
  try {
    const { data } = await listDocuments(
      appwriteDb,
      "notes",
      [Query.equal("profile_id", userId)],
      headers
    );
    return data.documents as Note[] | [];
  } catch (error) {
    console.error(error);

    if (error) return [];
  }
}

export async function createNote({
  title,
  body,
  userId,
  headers,
}: Pick<Note, "body" | "title"> & { userId: User["$id"]; headers: Headers }) {
  try {
    const { data } = await createDocument(
      appwriteDb,
      "notes",
      ID.unique(),
      {
        title,
        body,
        profile_id: userId,
      },
      undefined,
      headers
    );
    return data as Note;
  } catch (error) {
    console.error(error);

    if (error) return null;
  }
}

export async function deleteNote({
  id,
  userId,
  headers,
}: Pick<Note, "id"> & { userId: User["$id"]; headers: Headers }) {
  try {
    const note = await getNote({ id, userId, headers });
    if (!note) return null;

    const { response } = await deleteDocument(
      appwriteDb,
      "notes",
      note.id,
      headers
    );
    return response.status === 204 ? {} : null;
  } catch (error) {
    console.error(error);

    if (error) return null;
  }
  return null;
}

export async function getNote({
  id,
  userId,
  headers,
}: Pick<Note, "id"> & { userId: User["$id"]; headers: Headers }) {
  try {
    const { data } = await listDocuments(
      appwriteDb,
      "notes",
      [Query.equal("$id", id), Query.equal("profile_id", userId)],
      headers
    );
    if (data?.documents && data?.total > 0) {
      const doc = data?.documents?.at(0) as Note;
      return {
        userId: doc.profile_id,
        id: doc.$id,
        title: doc.title,
        body: doc.body,
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    if (error) return null;
  }
  return null;
}
