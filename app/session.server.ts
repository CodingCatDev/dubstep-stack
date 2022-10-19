import { appwriteProject, getCookieValue } from "./models/appwrite.server";
import { redirect } from "@remix-run/node";
import { getAccount } from "./models/user.server";

export async function getUserId(request: Request) {
  //Check to make sure cookie exists to avoid unnecessary API call
  const cookies = request.headers.get("cookie") || undefined;
  const cookie = getCookieValue({cookies, name:`a_session_${appwriteProject}_legacy`});
  if (cookie) {
    const accountResp = await getAccount(request.headers);
    const { data } = accountResp;
    return data?.$id;
  }
  return undefined;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;
  return userId;
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

  throw await logout(request);
}

export async function logout(request: Request) {
  return redirect("/", {
    headers: {
      "Set-Cookie": "",
    },
  });
}