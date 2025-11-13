import { useNavigate, useNavigation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getPostById, type Post } from "../services/postApi";
import type { Route } from "./+types/content";

type LoaderData = {
  post: Post | null;
  error: string;
};

const getAuthorName = (author: Post["author"]) => {
  if (!author) {
    return "Unknown Author";
  }

  if (typeof author === "string") {
    return author;
  }

  return author.name || author.email || "Unknown Author";
};

const getAuthorId = (author: Post["author"]) => {
  if (!author || typeof author === "string") {
    return undefined;
  }

  return author._id;
};

const getAuthorInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
};

const formatDate = (isoDate?: string | null) => {
  if (!isoDate) {
    return "";
  }

  return new Date(isoDate).toISOString().split("T")[0];
};

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const { id } = params;

  if (!id) {
    return {
      post: null,
      error: "Invalid post id",
    };
  }

  try {
    const response = await getPostById(id);

    return {
      post: response.post,
      error: "",
    };
  } catch (apiError) {
    const message =
      apiError instanceof Error ? apiError.message : "Failed to load post";
    return {
      post: null,
      error: message,
    };
  }
}

export default function ContentDetail({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { post, error } = loaderData;

  const authorName = post ? getAuthorName(post.author) : "Unknown Author";
  const authorId = post ? getAuthorId(post.author) : undefined;
  const authorInitials = getAuthorInitials(authorName);
  const formattedDate = formatDate(post?.createdAt);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleAuthorClick = () => {
    if (!authorId) {
      return;
    }
    navigate(`/users/${authorId}`);
  };

  if (navigation.state === "loading" && !post) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <p className="text-sm font-medium text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
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

        <article className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 border-b border-gray-200">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
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
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {authorInitials}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAuthorClick}
                    disabled={!authorId}
                    className="font-semibold text-gray-900 hover:text-amber-600 focus:outline-none disabled:cursor-default disabled:text-gray-400"
                  >
                    {authorName}
                  </button>
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
                {post.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).length === 0 && (
                  <span className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium">
                    No tags
                  </span>
                )}
                {(post.tags ?? []).map((tag, index) => (
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
}
