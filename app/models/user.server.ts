import type { Models } from "appwrite";
import { ID, Query } from "appwrite";
import {account, databases, appwriteDb} from "./config.server";

export interface User extends Models.Account<Models.Preferences>{}

export async function createUser(email: string, password: string) {
  const user = await account.create(ID.unique(), email, password);
  return user;
}

export async function getProfileById(id: string) {
  try {
    const data = await account.getPrefs();
    return data;
  } catch (error) {
    if (error) return null;
  }
}