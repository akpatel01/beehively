import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  deletePost,
  listPosts,
  updatePost,
  type Post,
} from "../services/postApi";

type EditFormState = {
  title: string;
  status: Post["status"];
  content: string;
  tags: string;
};

const Profile = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Guest");
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    status: "draft",
    content: "",
    tags: "",
  });
  const [savingPostId, setSavingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [pendingDeletePost, setPendingDeletePost] = useState<Post | null>(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) {
      setUserName("Guest");
      setUserId(null);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (
        parsedUser &&
        typeof parsedUser.name === "string" &&
        parsedUser.name.trim()
      ) {
        setUserName(parsedUser.name);
      }

      if (parsedUser && typeof parsedUser.id === "string") {
        setUserId(parsedUser.id);
      } else {
        setUserId(null);
        setLoading(false);
      }
    } catch (parseError) {
      console.error("Failed to parse stored user", parseError);
      setUserName("Guest");
      setUserId(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await listPosts({ author: userId });
      setPosts(response.posts || []);
    } catch (apiError) {
      const message =
        apiError instanceof Error ? apiError.message : "Failed to load posts";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const postsCountLabel = useMemo(() => {
    if (loading) {
      return "Loading your posts...";
    }

    const count = posts.length;
    if (!count) {
      return "You have no posts yet.";
    }

    return count === 1 ? "You have 1 post." : `You have ${count} posts.`;
  }, [loading, posts.length]);

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleOpenPost = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleEditPost = (id: string) => {
    const postToEdit = posts.find((item) => item._id === id);
    if (!postToEdit) {
      return;
    }

    setError("");
    setEditingPostId(id);
    setEditForm({
      title: postToEdit.title,
      status: postToEdit.status,
      content: postToEdit.content,
      tags: (postToEdit.tags || []).join(", "),
    });
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const rawValue = event.currentTarget.value;
    const segments = rawValue.split(",");
    const candidate = segments.pop()?.trim() ?? "";
    const existing = segments.map((segment) => segment.trim()).filter(Boolean);

    const nextTags = [...existing];
    if (candidate) {
      nextTags.push(candidate);
    }

    const formatted = nextTags.join(", ");
    const nextValue = formatted ? `${formatted}, ` : "";
    setEditForm((prev) => ({
      ...prev,
      tags: nextValue,
    }));

    // move caret to end on next tick so users can continue typing
    requestAnimationFrame(() => {
      event.currentTarget.selectionStart = event.currentTarget.selectionEnd =
        nextValue.length;
    });
  };

  const handleUpdatePost = async (
    event: FormEvent<HTMLFormElement>,
    id: string
  ) => {
    event.preventDefault();

    if (!editForm.title.trim() || !editForm.content.trim()) {
      setError("Title and content are required");
      return;
    }

    const normalizedTags = editForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      setSavingPostId(id);
      setError("");
      const response = await updatePost(id, {
        title: editForm.title.trim(),
        status: editForm.status,
        content: editForm.content.trim(),
        tags: normalizedTags,
      });

      setPosts((prev) =>
        prev.map((item) => (item._id === id ? response.post : item))
      );
      handleCancelEdit();
    } catch (apiError) {
      const message =
        apiError instanceof Error
          ? apiError.message
          : "Failed to update the post";
      setError(message);
    } finally {
      setSavingPostId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditForm({
      title: "",
      status: "draft",
      content: "",
      tags: "",
    });
  };

  const openDeleteModal = (post: Post) => {
    setPendingDeletePost(post);
  };

  const closeDeleteModal = () => {
    setPendingDeletePost(null);
  };

  const handleDeletePost = async (post: Post) => {
    try {
      setDeletingPostId(post._id);
      setError("");
      await deletePost(post._id);
      setPosts((prev) => prev.filter((item) => item._id !== post._id));
      if (editingPostId === post._id) {
        handleCancelEdit();
      }
      closeDeleteModal();
    } catch (apiError) {
      const message =
        apiError instanceof Error
          ? apiError.message
          : "Failed to delete the post";
      setError(message);
    } finally {
      setDeletingPostId(null);
    }
  };

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [posts]
  );

  const statusBadgeClass = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-600";
      case "archived":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const readableStatus = (status: Post["status"]) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">{userName}</h1>
          <p className="text-sm text-gray-500 mt-1">{postsCountLabel}</p>
          <button
            onClick={handleCreatePost}
            className="mt-4 inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Create New Post
          </button>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
              Loading your posts...
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border border-red-200 text-red-600 rounded-xl p-8 text-center text-sm">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            sortedPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleOpenPost(post._id)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          {post.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags && post.tags.length > 0 ? (
                            post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-400 rounded-full">
                              No tags
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadgeClass(
                          post.status
                        )}`}
                      >
                        {readableStatus(post.status)}
                      </span>
                    </div>
                  </button>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEditPost(post._id)}
                      className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(post)}
                      className="border border-red-300 text-red-600 rounded-lg px-4 py-2 text-xs font-medium hover:bg-red-50"
                    >
                      Delete
                    </button>
                    {pendingDeletePost && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="max-w-md w-full rounded-2xl bg-white shadow-xl p-6 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="space-y-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Delete post?
                              </h3>
                              <p className="text-sm text-gray-600">
                                This will permanently remove&nbsp;
                                <span className="font-medium text-gray-900">
                                  {pendingDeletePost.title}
                                </span>
                                . You can’t undo this action.
                              </p>
                            </div>
                          </div>
                          <div className="bg-gray-50 -mx-6 px-6 py-4 rounded-b-2xl flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                            <button
                              type="button"
                              onClick={closeDeleteModal}
                              className="w-full sm:w-auto border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeletePost(pendingDeletePost)
                              }
                              disabled={
                                deletingPostId === pendingDeletePost._id
                              }
                              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingPostId === pendingDeletePost._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {editingPostId === post._id && (
                    <form
                      onSubmit={(event) => handleUpdatePost(event, post._id)}
                      className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                    >
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          htmlFor={`title-${post._id}`}
                        >
                          Title
                        </label>
                        <input
                          id={`title-${post._id}`}
                          type="text"
                          value={editForm.title}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          htmlFor={`status-${post._id}`}
                        >
                          Status
                        </label>
                        <select
                          id={`status-${post._id}`}
                          value={editForm.status}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              status: event.target.value as Post["status"],
                            }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          htmlFor={`content-${post._id}`}
                        >
                          Content
                        </label>
                        <textarea
                          id={`content-${post._id}`}
                          value={editForm.content}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              content: event.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          htmlFor={`tags-${post._id}`}
                        >
                          Tags (comma separated)
                        </label>
                        <input
                          id={`tags-${post._id}`}
                          type="text"
                          value={editForm.tags}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              tags: event.target.value,
                            }))
                          }
                          onKeyDown={handleTagKeyDown}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={savingPostId === post._id}
                          className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-xs font-medium"
                        >
                          {savingPostId === post._id
                            ? "Saving..."
                            : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={savingPostId === post._id}
                          className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ))}

          {!loading && !error && posts.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
              No posts yet. Hit the button above to create your first one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
