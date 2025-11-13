import { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { createPost } from "../services/postApi";
import { getCookie } from "~/utils/storage";

type PostFormState = {
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  tags: string[];
  tagsInput: string;
};

type FieldErrors = {
  title: string;
  content: string;
  status: string;
};

const initialFormState: PostFormState = {
  title: "",
  content: "",
  status: "draft",
  tags: [],
  tagsInput: "",
};

const isPostStatus = (value: unknown): value is PostFormState["status"] => {
  return value === "draft" || value === "published" || value === "archived";
};

type ActionData = {
  fieldErrors: FieldErrors;
  formError: string;
  values: PostFormState;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const titleEntry = formData.get("title");
  const contentEntry = formData.get("content");
  const statusEntry = formData.get("status");
  const tagsInputEntry = formData.get("tagsInput");

  const rawTitle = typeof titleEntry === "string" ? titleEntry : "";
  const rawContent = typeof contentEntry === "string" ? contentEntry : "";
  const rawStatus = typeof statusEntry === "string" ? statusEntry : "";
  const rawTagsInput = typeof tagsInputEntry === "string" ? tagsInputEntry : "";

  const existingTags = formData
    .getAll("tags")
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);

  const title = rawTitle.trim();
  const content = rawContent.trim();
  const status = isPostStatus(rawStatus) ? rawStatus : "draft";
  const pendingTag = rawTagsInput.trim();

  const tagsForRequest = pendingTag
    ? Array.from(new Set([...existingTags, pendingTag]))
    : existingTags;

  const fieldErrors: FieldErrors = {
    title: title ? "" : "Title is required",
    content: content ? "" : "Content is required",
    status: status ? "" : "Status is required",
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
      formError: "Please fill in the required fields.",
      values: {
        title: rawTitle,
        content: rawContent,
        status,
        tags: existingTags,
        tagsInput: rawTagsInput,
      },
    };
  }

  try {
    const token = getCookie("token", { request });

    await createPost(
      {
        title,
        content,
        status,
        tags: tagsForRequest,
      },
      token
    );

    return redirect("/profile");
  } catch (apiError) {
    const message =
      apiError instanceof Error ? apiError.message : "Unable to create post";

    return {
      fieldErrors: { title: "", content: "", status: "" },
      formError: message,
      values: {
        title: rawTitle,
        content: rawContent,
        status,
        tags: existingTags,
        tagsInput: rawTagsInput,
      },
    };
  }
}

export default function CreatePost() {
  const navigate = useNavigate();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [formData, setFormData] = useState<PostFormState>(initialFormState);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    title: "",
    content: "",
    status: "",
  });

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!actionData) {
      return;
    }

    setFieldErrors(actionData.fieldErrors);
    setError(actionData.formError ?? "");
    setFormData(actionData.values);
  }, [actionData]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    if (name === "title" || name === "content") {
      const fieldName = name as keyof FieldErrors;
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value.trim()
          ? ""
          : `${fieldName === "title" ? "Title" : "Content"} is required`,
      }));
    }
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      status: value as PostFormState["status"],
    }));
    setError("");

    setFieldErrors((prev) => ({
      ...prev,
      status: value ? "" : "Status is required",
    }));
  };

  const handleTagAdd = () => {
    const trimmed = formData.tagsInput.trim();
    if (!trimmed) return;

    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(trimmed) ? prev.tags : [...prev.tags, trimmed],
      tagsInput: "",
    }));
    setError("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleTagAdd();
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Create New Post
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the form below with your post details. Keep it simple and
            clear.
          </p>
        </div>

        <Form
          method="post"
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
        >
          {formData.tags.map((tag, index) => (
            <input
              key={`tag-${tag}-${index}`}
              type="hidden"
              name="tags"
              value={tag}
            />
          ))}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleFieldChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              placeholder="Post title"
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleFieldChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              placeholder="Write everything you want to share"
              rows={6}
            />
            {fieldErrors.content && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              {fieldErrors.status && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.status}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="tags"
              >
                Tags
              </label>
              <div className="space-y-3">
                <input
                  id="tags"
                  name="tagsInput"
                  type="text"
                  value={formData.tagsInput}
                  onChange={handleFieldChange}
                  onKeyDown={handleTagKeyDown}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="Press Enter after each tag"
                />
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="text-amber-600 hover:text-amber-800"
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-lg px-5 py-2 text-sm font-medium"
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
