import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { getPostById, type Post } from "../services/postApi";

const ContentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [content, setContent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) {
      setError("Invalid post id");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getPostById(id);
      setContent(response.post);
    } catch (apiError) {
      const message =
        apiError instanceof Error ? apiError.message : "Failed to load post";
      setError(message);
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  const authorName = useMemo(() => {
    if (!content?.author) {
      return "Unknown Author";
    }

    if (typeof content.author === "string") {
      return content.author;
    }

    return content.author.name || content.author.email || "Unknown Author";
  }, [content?.author]);

  const authorInitials = useMemo(() => {
    const name = authorName;
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [authorName]);

  const formattedDate = useMemo(() => {
    if (!content?.createdAt) {
      return "";
    }
    return new Date(content.createdAt).toLocaleDateString();
  }, [content?.createdAt]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <p className="text-sm font-medium text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Something went wrong" : "Content not found"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {error ?? "The post you are looking for might have been removed."}
          </p>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {/* Content card */}
        <article className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 border-b border-gray-200">
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {content.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {authorInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{authorName}</p>
                  <p className="text-xs text-gray-500">
                    {formattedDate || "Recently updated"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {content.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {(content.tags ?? []).length === 0 && (
                  <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium">
                    No tags
                  </span>
                )}
                {(content.tags ?? []).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleBack}
                className="flex-1 min-w-[200px] px-6 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-300"
              >
                Back to List
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 min-w-[200px] px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Go to Home
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ContentDetail;
