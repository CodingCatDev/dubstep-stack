import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = await requireUserId(request);

  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  const note = await createNote({
    title,
    body,
    userId,
    headers: request.headers,
  });
  return redirect(`/notes/${note?.$id}`);
};

export default function NewNotePage() {
  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex flex-col w-full gap-1">
          <span>Title: </span>
          <input
            name="title"
            className="flex-1 px-3 text-lg leading-loose border-2 border-blue-500 rounded-md"
          />
        </label>
      </div>
      <div>
        <label className="flex flex-col w-full gap-1">
          <span>Body: </span>
          <textarea
            name="body"
            rows={8}
            className="flex-1 w-full px-3 py-2 text-lg leading-6 border-2 border-blue-500 rounded-md"
          ></textarea>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
