import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfile, type PublicUser } from "../services/userApi";
import type { Post } from "../services/postApi";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    if (!id) {
      setError("Invalid user id");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getUserProfile(id);
      setUser(response.user);
      setPosts(response.posts ?? []);
    } catch (apiError) {
      const message =
        apiError instanceof Error
          ? apiError.message
          : "Failed to load user profile";
      setError(message);
      setUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const postCountLabel = useMemo(() => {
    if (loading) {
      return "Loading posts...";
    }

    const count = posts.length;
    if (count === 0) {
      return "No published posts yet.";
    }

    return count === 1 ? "1 published post" : `${count} published posts`;
  }, [loading, posts.length]);

  const handleOpenPost = (postId: string) => {
    navigate(`/content/${postId}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <p className="text-sm font-medium text-gray-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {error ? "Unable to load profile" : "User not found"}
          </h2>
          <p className="text-sm text-gray-600">
            {error ??
              "The user you are looking for may have been removed or never existed."}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                  {user.name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0]?.toUpperCase())
                    .join("")
                    .slice(0, 2) || "U"}
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {user.name}
                  </h1>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">{postCountLabel}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleBack}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleGoHome}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition"
              >
                Home
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 text-sm">
              This user hasn&apos;t published any posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => handleOpenPost(post._id)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                    Published
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(post.tags ?? []).length === 0 ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-400">
                      No tags
                    </span>
                  ) : (
                    post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
