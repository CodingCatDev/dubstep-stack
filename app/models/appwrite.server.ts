import invariant from "tiny-invariant";
import { Client, Account, Databases, AppwriteException } from "appwrite";

// Abstract this away
export const appwriteEndpoint = process.env.APPWRITE_ENDPOINT as string;
export const appwriteProject = process.env.APPWRITE_PROJECT as string;
export const appwriteDb = process.env.APPWRITE_DB as string;

invariant(
  appwriteEndpoint,
  "APPWRITE_ENDPOINT must be set in your environment variables."
);
invariant(
  appwriteProject,
  "APPWRITE_PROJECT must be set in your environment variables."
);
invariant(appwriteDb, "APPWRITE_DB must be set in your environment variables.");

// export const client = new Client()
//   .setEndpoint(appwriteEndpoint)
//   .setProject(appwriteProject);

// export const account = new Account(client);
// export const databases = new Databases(client);

/** Below copied from APPWRITE changed to return full API call
 * so that the Set-Cookie can be extracted for servside
 * this should be set so that client can setJWT to pass.
 */

export type Payload = {
  [key: string]: any;
};

export async function call(
  method: string,
  url: URL,
  inputHeaders: Headers = new Headers(),
  params: Payload = {}
): Promise<{ data: any; response: Response }> {
  method = method.toUpperCase();

  const headers = new Headers();
  headers.set("content-type", inputHeaders.get("content-type") || '');
  headers.set("X-Appwrite-Project", appwriteProject);
  headers.set("x-sdk-name", "Web");
  headers.set("x-sdk-platform", "client");
  headers.set("x-sdk-language", "web");
  headers.set("x-sdk-version", "10.1.0");
  headers.set("X-Appwrite-Response-Format", "1.0.0");

  let options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  const cookies = inputHeaders.get("cookie") || undefined;
  const cookieFallback = getCookieValue({
    cookies,
    name: `a_session_${appwriteProject}_legacy`,
  });

  if (cookieFallback) {
    headers.set("X-Fallback-Cookies", cookieFallback);
    headers.set("cookie", inputHeaders.get("cookie") || "");
  }

  if (method === "GET") {
    for (const [key, value] of Object.entries(flatten(params))) {
      url.searchParams.append(key, value);
    }
  } else {
    switch (headers.get("content-type")) {
      case "application/json":
        options.body = JSON.stringify(params);
        break;

      case "multipart/form-data":
        let formData = new FormData();

        for (const key in params) {
          if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
              formData.append(key + "[]", value);
            });
          } else {
            formData.append(key, params[key]);
          }
        }

        options.body = formData;
        headers.delete("content-type");
        break;
    }
  }

  try {
    let data = null;
    const response = await fetch(url.toString(), options);

    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        message: await response.text(),
      };
    }

    if (400 <= response.status) {
      throw new AppwriteException(
        data?.message,
        response.status,
        data?.type,
        data
      );
    }
    return { response, data };
  } catch (e) {
    if (e instanceof AppwriteException) {
      throw e;
    }
    throw new AppwriteException((e as Error).message);
  }
}

export function flatten(data: Payload, prefix = ""): Payload {
  let output: Payload = {};

  for (const key in data) {
    let value = data[key];
    let finalKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      output = Object.assign(output, flatten(value, finalKey));
    } else {
      output[finalKey] = value;
    }
  }

  return output;
}
export const getCookieValue = ({
  cookies,
  name,
}: {
  cookies?: string;
  name: string;
}) =>
  !cookies
    ? undefined
    : cookies.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
