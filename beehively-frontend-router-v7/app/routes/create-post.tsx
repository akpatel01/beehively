import { useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent, } from "react";
import { Form, useActionData, useNavigate, redirect } from "react-router";
import { createPost } from "../services/postApi";

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

export default function CreatePost() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PostFormState>(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
        title: "",
        content: "",
        status: "",
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const pendingTag = formData.tagsInput.trim();
        const tags = pendingTag
            ? Array.from(new Set([...formData.tags, pendingTag]))
            : formData.tags;

        const errors: FieldErrors = {
            title: formData.title.trim() ? "" : "Title is required",
            content: formData.content.trim() ? "" : "Content is required",
            status: formData.status ? "" : "Status is required",
        };

        setFieldErrors(errors);
        setError("");

        if (Object.values(errors).some(Boolean)) {
            setError("Please fill in the required fields.");
            return;
        }

        setLoading(true);

        try {
            await createPost({
                title: formData.title,
                content: formData.content,
                status: formData.status,
                tags,
            });

            setFormData(initialFormState);
            navigate("/profile");
        } catch (apiError) {
            const message =
                apiError instanceof Error ? apiError.message : "Unable to create post";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

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

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
                >
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
                            disabled={loading}
                            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-lg px-5 py-2 text-sm font-medium"
                        >
                            {loading ? "Publishing..." : "Publish Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
