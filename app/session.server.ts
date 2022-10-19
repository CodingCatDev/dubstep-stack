import { redirect } from "@remix-run/node";
import { getAccount, getProfileById } from "./models/user.server";

export async function getUserId(request: Request) {
  const fallbackCookie = request.headers.get("cookie")?.split("=")?.at(1);
  const session = await getAccount(fallbackCookie || "");
  return undefined;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getProfileById(userId);
  if (user) return user;

  throw await logout(request);
}

/**
 * Require a user session to get to a page. If none is found
 * redirect them to the login page. After login, take them to
 * the original page they wanted to get to.
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  if (userId == undefined) return null;

  const profile = await getProfileById(userId);
  if (profile) return profile;

  throw await logout(request);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": "",
    },
  });
}
