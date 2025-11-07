import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const Profile = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Guest");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      date: "2 days ago",
      status: "Published",
      content: "Basics of React components and hooks with simple explanations.",
      tags: "react, basics",
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      date: "5 days ago",
      status: "Draft",
      content:
        "Notes about generics and utility types to clean up large codebases.",
      tags: "typescript, advanced",
    },
    {
      id: 3,
      title: "Building Responsive Designs",
      date: "1 week ago",
      status: "Published",
      content:
        "Quick tips for making layouts adapt on phone and desktop screens.",
      tags: "css, responsive",
    },
  ]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("Published");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) {
      setUserName("Guest");
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
    } catch (error) {
      console.error("Failed to parse stored user", error);
      setUserName("Guest");
    }
  }, []);

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleOpenPost = (id: number) => {
    navigate(`/content/${id}`);
  };

  const handleEditPost = (id: number) => {
    const postToEdit = posts.find((item) => item.id === id);
    if (!postToEdit) {
      return;
    }

    setEditingPostId(id);
    setEditTitle(postToEdit.title);
    setEditStatus(postToEdit.status);
    setEditContent(postToEdit.content);
    setEditTags(postToEdit.tags);
  };

  const handleUpdatePost = (event: FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault();

    setPosts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: editTitle,
              status: editStatus,
              content: editContent,
              tags: editTags,
            }
          : item
      )
    );

    setEditingPostId(null);
    setEditTitle("");
    setEditStatus("Published");
    setEditContent("");
    setEditTags("");
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditStatus("Published");
    setEditContent("");
    setEditTags("");
  };

  const handleDeletePost = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      return;
    }

    setPosts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">{userName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have {posts.length} posts right now.
          </p>
          <button
            onClick={handleCreatePost}
            className="mt-4 inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Create New Post
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleOpenPost(post.id)}
                  className="w-full text-left"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-500">{post.date}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        post.status.toLowerCase() === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </button>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="border border-red-300 text-red-600 rounded-lg px-4 py-2 text-xs font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>

                {editingPostId === post.id && (
                  <form
                    onSubmit={(event) => handleUpdatePost(event, post.id)}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                  >
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor={`title-${post.id}`}
                      >
                        Title
                      </label>
                      <input
                        id={`title-${post.id}`}
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor={`status-${post.id}`}
                      >
                        Status
                      </label>
                      <select
                        id={`status-${post.id}`}
                        value={editStatus}
                        onChange={(event) => setEditStatus(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor={`content-${post.id}`}
                      >
                        Content
                      </label>
                      <textarea
                        id={`content-${post.id}`}
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-700 mb-1"
                        htmlFor={`tags-${post.id}`}
                      >
                        Tags (comma separated)
                      </label>
                      <input
                        id={`tags-${post.id}`}
                        type="text"
                        value={editTags}
                        onChange={(event) => setEditTags(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-xs font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
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

          {posts.length === 0 && (
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
