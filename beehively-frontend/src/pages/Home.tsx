import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPosts, type Post } from "../services/postApi";

type SortOption = "newest" | "oldest" | "title";

const getAuthorName = (author: Post["author"]) => {
  if (!author) {
    return "Unknown author";
  }

  if (typeof author === "string") {
    return author;
  }

  return author.name || "Unknown author";
};

const Home = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await listPosts({ status: "published" });
      setPosts(response.posts);
    } catch (apiError) {
      const message =
        apiError instanceof Error ? apiError.message : "Failed to load posts";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const sortedPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? posts.filter((post) => post.title.toLowerCase().includes(term))
      : posts;
    const sorted = [...filtered];

    if (sortBy === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [posts, sortBy, searchTerm]);

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trending Content
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover amazing content created by our community
              </p>
            </div>

            {/* Search + Sorting */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <label
                  htmlFor="search-posts"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Search by title
                </label>
                <div className="relative">
                  <input
                    id="search-posts"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search posts"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-amber-600 hover:text-amber-500"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
                <span className="text-sm font-medium text-gray-600">
                  Sort by:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={
                      sortBy === "newest"
                        ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy("oldest")}
                    className={
                      sortBy === "oldest"
                        ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    Oldest
                  </button>
                  <button
                    onClick={() => setSortBy("title")}
                    className={
                      sortBy === "title"
                        ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    A–Z
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of content cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading && (
              <div className="col-span-full text-center text-gray-500">
                Loading posts...
              </div>
            )}
            {!loading && error && (
              <div className="col-span-full text-center text-red-500">
                {error}
              </div>
            )}
            {!loading && !error && sortedPosts.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                No posts available yet.
              </div>
            )}
            {!loading &&
              !error &&
              sortedPosts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/content/${item._id}`)}
                  className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium text-gray-700">
                        {getAuthorName(item.author)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
