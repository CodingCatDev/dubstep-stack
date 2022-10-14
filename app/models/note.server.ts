import type { Models } from "node-appwrite";
import { Query, ID } from "node-appwrite";
import type { User } from "./user.server";
import { databases, appwriteDb } from "./config.server";

export interface Note extends Models.Document {
  id: string;
  title: string;
  body: string;
  profile_id: string;
}

export async function getNoteListItems({ userId }: { userId: User["id"] }) {
  try {
    const data = await databases.listDocuments(appwriteDb, "notes", [
      Query.equal("profile_id", userId),
    ]);
    return data.documents as Note[] | [];
  } catch (error) {
    if (error) return [];
  }
}

export async function createNote({
  title,
  body,
  userId,
}: Pick<Note, "body" | "title"> & { userId: User["id"] }) {
  try {
    const data = await databases.createDocument(
      appwriteDb,
      "notes",
      ID.unique(),
      {
        title,
        body,
        profile_id: userId,
      }
    );
    return data as Note;
  } catch (error) {
    if (error) return null;
  }
}

export async function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  try {
    const note = await getNote({ id, userId });
    if (!note) return null;

    const res = await databases.deleteDocument(appwriteDb, "notes", note.id);
    return res.status === 204 ? {} : null;
  } catch (error) {
    if (error) return null;
  }
  return null;
}

export async function getNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  try {
    const data = await databases.listDocuments(appwriteDb, "notes", [
      Query.equal("$id", id),
      Query.equal("profile_id", userId),
    ]);
    if (data?.documents && data?.total > 0) {
      const doc = data?.documents?.at(1) as Note;
      return {
        userId: doc.profile_id,
        id: doc.$id,
        title: doc.title,
        body: doc.body,
      };
    }
    return null;
  } catch (error) {
    if (error) return null;
  }
  return null;
}
