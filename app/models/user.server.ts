import type { Models } from "node-appwrite";
import { ID, Query } from "node-appwrite";
import {users, databases, appwriteDb} from "./config.server";

export interface User extends Models.User<Models.Preferences>{}

export async function createUser(email: string, password: string) {
  const user = await users.create(ID.unique(), email, undefined, password);
  return user;
}

export async function getProfileById(id: string) {
  try {
    const data = await users.getPrefs(id);
    return data;
  } catch (error) {
    if (error) return null;
  }
}

export async function verifyLogin(email: string, password: string) {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) return undefined;
  const profile = await getProfileByEmail(user?.email);

  return profile;
}
