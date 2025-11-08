import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  bulkDeletePosts,
  deletePost,
  listPosts,
  restorePosts,
  updatePost,
  type Post,
} from "../services/postApi";

type EditFormState = {
  title: string;
  status: Post["status"];
  content: string;
  tags: string;
};

type UndoInfo = {
  posts: Post[];
  message: string;
};

const Profile = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Guest");
  const [userId, setUserId] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<Post["status"] | "all">(
    "all"
  );
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
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [pendingBulkDeletePosts, setPendingBulkDeletePosts] = useState<Post[]>(
    []
  );
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [undoInfo, setUndoInfo] = useState<UndoInfo | null>(null);

  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") {
      return allPosts;
    }
    return allPosts.filter((post) => post.status === statusFilter);
  }, [allPosts, statusFilter]);

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
  }, [userId, statusFilter]);

  const fetchUserPosts = async () => {
    if (!userId) {
      setAllPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await listPosts({
        author: userId,
      });
      setAllPosts(response.posts || []);
      setSelectedPostIds([]);
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

    const count = filteredPosts.length;
    if (!count) {
      return "You have no posts yet.";
    }

    return count === 1 ? "You have 1 post." : `You have ${count} posts.`;
  }, [loading, filteredPosts.length]);

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleOpenPost = (id: string) => {
    navigate(`/content/${id}`);
  };

  const selectableIds = useMemo(
    () => filteredPosts.map((post) => post._id),
    [filteredPosts]
  );
  const isAllSelected =
    selectableIds.length > 0 && selectedPostIds.length === selectableIds.length;
  const selectedCount = selectedPostIds.length;
  const hasSelection = selectedCount > 0;

  const toggleSelectPost = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds([...selectableIds]);
    }
  };

  const clearSelection = () => setSelectedPostIds([]);

  const handleEditPost = (id: string) => {
    const postToEdit = allPosts.find((item) => item._id === id);
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

      setAllPosts((prev) =>
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

  const openBulkDeleteModal = () => {
    const postsToDelete = filteredPosts.filter((post) =>
      selectedPostIds.includes(post._id)
    );
    if (!postsToDelete.length) {
      return;
    }
    setPendingBulkDeletePosts(postsToDelete);
  };

  const closeBulkDeleteModal = () => {
    setPendingBulkDeletePosts([]);
  };

  const handleDeletePost = async (post: Post) => {
    try {
      setDeletingPostId(post._id);
      setError("");
      await deletePost(post._id);
      setAllPosts((prev) => prev.filter((item) => item._id !== post._id));
      setSelectedPostIds((prev) => prev.filter((id) => id !== post._id));
      if (editingPostId === post._id) {
        handleCancelEdit();
      }
      setUndoInfo({
        posts: [post],
        message: `Deleted "${post.title}"`,
      });
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

  const handleBulkDelete = async () => {
    if (!pendingBulkDeletePosts.length) {
      return;
    }

    const ids = pendingBulkDeletePosts.map((post) => post._id);

    try {
      setBulkDeleting(true);
      setError("");
      await bulkDeletePosts({ ids });
      setAllPosts((prev) => prev.filter((item) => !ids.includes(item._id)));
      setSelectedPostIds((prev) => prev.filter((id) => !ids.includes(id)));
      setUndoInfo({
        posts: pendingBulkDeletePosts,
        message:
          ids.length === 1
            ? `Deleted "${pendingBulkDeletePosts[0].title}"`
            : `${ids.length} posts deleted`,
      });
      closeBulkDeleteModal();
    } catch (apiError) {
      const message =
        apiError instanceof Error
          ? apiError.message
          : "Failed to delete the selected posts";
      setError(message);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleUndoDelete = async () => {
    if (!undoInfo || undoInfo.posts.length === 0) {
      return;
    }

    const ids = undoInfo.posts.map((post) => post._id);

    try {
      setError("");
      const response = await restorePosts({ ids });
      const restoredPosts = response.posts ?? [];
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const postsToAdd = (
          restoredPosts.length ? restoredPosts : undoInfo.posts
        ).filter((post) => !existingIds.has(post._id));
        return [...prev, ...postsToAdd];
      });
      setUndoInfo(null);
    } catch (apiError) {
      const message =
        apiError instanceof Error
          ? apiError.message
          : "Failed to restore posts";
      setError(message);
    }
  };

  const handleDismissUndo = () => {
    setUndoInfo(null);
  };

  const sortedPosts = useMemo(
    () =>
      [...filteredPosts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filteredPosts]
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
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {userName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{postsCountLabel}</p>
            </div>
            <button
              onClick={handleCreatePost}
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Create New Post
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="status-filter"
              className="text-sm font-semibold text-gray-700"
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
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

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                <span className="font-medium">Select all</span>
                {hasSelection && (
                  <span className="text-xs text-gray-500">
                    {selectedCount} selected
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={!hasSelection}
                  className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={openBulkDeleteModal}
                  disabled={!hasSelection}
                  className="border border-red-300 text-red-600 rounded-lg px-4 py-2 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {hasSelection
                    ? `Delete Selected (${selectedCount})`
                    : "Delete Selected"}
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            sortedPosts.map((post) => {
              const isSelected = selectedPostIds.includes(post._id);

              return (
                <div
                  key={post._id}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        checked={isSelected}
                        onChange={() => toggleSelectPost(post._id)}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
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
                      </div>

                      {editingPostId === post._id && (
                        <form
                          onSubmit={(event) =>
                            handleUpdatePost(event, post._id)
                          }
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
                </div>
              );
            })}

          {pendingDeletePost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="max-w-md w-full rounded-2xl bg-white shadow-xl p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete post?
                  </h3>
                  <p className="text-sm text-gray-600">
                    This moves{" "}
                    <span className="font-medium text-gray-900">
                      {pendingDeletePost.title}
                    </span>{" "}
                    to the trash. You can undo the deletion using the banner
                    that appears afterward.
                  </p>
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
                    onClick={() => handleDeletePost(pendingDeletePost)}
                    disabled={deletingPostId === pendingDeletePost._id}
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

          {pendingBulkDeletePosts.length > 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="max-w-md w-full rounded-2xl bg-white shadow-xl p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete selected posts?
                  </h3>
                  <p className="text-sm text-gray-600">
                    You are about to delete {pendingBulkDeletePosts.length}{" "}
                    {pendingBulkDeletePosts.length === 1 ? "post" : "posts"}.
                    You can undo the deletion right after confirming.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {pendingBulkDeletePosts.slice(0, 3).map((post) => (
                      <li key={post._id}>• {post.title}</li>
                    ))}
                    {pendingBulkDeletePosts.length > 3 && (
                      <li className="italic">
                        + {pendingBulkDeletePosts.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
                <div className="bg-gray-50 -mx-6 px-6 py-4 rounded-b-2xl flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
                  <button
                    type="button"
                    onClick={closeBulkDeleteModal}
                    className="w-full sm:w-auto border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleting}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {bulkDeleting ? "Deleting..." : "Delete selected"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {undoInfo && (
            <div className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg">
              <span className="text-sm font-medium">{undoInfo.message}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleUndoDelete}
                  className="rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold hover:bg-white/20 transition"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={handleDismissUndo}
                  className="rounded-lg bg-white/0 px-3 py-1 text-sm hover:bg-white/10 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
              {statusFilter === "all"
                ? "No posts yet. Hit the button above to create your first one."
                : "No posts found for this status."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
