import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
  useNavigate,
  useSubmit,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { listPosts, type Post } from "../services/postApi";

type SortOption = "newest" | "oldest" | "title";

type LoaderData = {
  posts: Post[];
  error: string;
  sortBy: SortOption;
  searchTerm: string;
};

const DEFAULT_SORT: SortOption = "newest";
const SEARCH_DEBOUNCE_MS = 300;

const getAuthorName = (author: Post["author"]) => {
  if (!author) {
    return "Unknown author";
  }

  if (typeof author === "string") {
    return author;
  }

  return author.name || "Unknown author";
};

const getAuthorId = (author: Post["author"]) => {
  if (!author || typeof author === "string") {
    return undefined;
  }

  return author._id;
};

const isSortOption = (value: unknown): value is SortOption => {
  return value === "newest" || value === "oldest" || value === "title";
};

const filterAndSortPosts = (
  posts: Post[],
  sortBy: SortOption,
  searchTerm: string
) => {
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
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const sortParam = url.searchParams.get("sort");
  const searchParam = url.searchParams.get("search") ?? "";
  const sortBy = isSortOption(sortParam) ? sortParam : DEFAULT_SORT;

  try {
    const response = await listPosts({ status: "published" });
    const posts = filterAndSortPosts(response.posts, sortBy, searchParam);
    return {
      posts,
      error: "",
      sortBy,
      searchTerm: searchParam,
    };
  } catch (apiError) {
    const message =
      apiError instanceof Error ? apiError.message : "Failed to load posts";
    return {
      posts: [],
      error: message,
      sortBy,
      searchTerm: searchParam,
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submittedSort = formData.get("sortBy");
  const submittedSearch = formData.get("searchTerm") ?? "";

  const sortBy = isSortOption(submittedSort) ? submittedSort : DEFAULT_SORT;
  const searchTerm =
    typeof submittedSearch === "string" ? submittedSearch.trim() : "";

  const url = new URL(request.url);

  if (searchTerm) {
    url.searchParams.set("search", searchTerm);
  } else {
    url.searchParams.delete("search");
  }

  if (sortBy === DEFAULT_SORT) {
    url.searchParams.delete("sort");
  } else {
    url.searchParams.set("sort", sortBy);
  }

  return redirect(url.pathname + url.search);
}

export default function Home() {
  const navigate = useNavigate();
  const {
    posts,
    error,
    sortBy: loaderSort,
    searchTerm: loaderSearch,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [sortBy, setSortBy] = useState<SortOption>(loaderSort);
  const [searchTerm, setSearchTerm] = useState(loaderSearch);

  useEffect(() => {
    setSortBy(loaderSort);
  }, [loaderSort]);

  useEffect(() => {
    setSearchTerm(loaderSearch);
  }, [loaderSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleAuthorClick = (
    event: MouseEvent<HTMLButtonElement>,
    authorId?: string
  ) => {
    event.stopPropagation();
    if (!authorId) {
      return;
    }
    navigate(`/users/${authorId}`);
  };

  const submitForm = (override?: {
    sortBy?: SortOption;
    searchTerm?: string;
  }) => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);

    if (override?.sortBy) {
      formData.set("sortBy", override.sortBy);
    }

    if (override?.searchTerm !== undefined) {
      formData.set("searchTerm", override.searchTerm);
    }

    submit(formData, { method: "post", replace: true });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSearchTerm(nextValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      submitForm({ searchTerm: nextValue });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setSearchTerm("");
    submitForm({ searchTerm: "" });
  };

  const handleSortChange = (nextSort: SortOption) => {
    if (sortBy === nextSort) {
      return;
    }

    setSortBy(nextSort);
    submitForm({ sortBy: nextSort });
  };

  const isBusy = navigation.state !== "idle";
  const hasPosts = posts.length > 0;

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
            <Form
              method="post"
              replace
              ref={formRef}
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <input type="hidden" name="sortBy" value={sortBy} />
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
                    name="searchTerm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search posts"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-amber-600 hover:text-amber-500"
                    ></button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
                <span className="text-sm font-medium text-gray-600">
                  Sort by:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSortChange("newest")}
                    className={
                      sortBy === "newest"
                        ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    Newest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("oldest")}
                    className={
                      sortBy === "oldest"
                        ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    Oldest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("title")}
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
            </Form>
          </div>

          {/* Grid of content cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isBusy && (
              <div className="col-span-full text-center text-gray-500">
                Loading posts...
              </div>
            )}
            {!isBusy && error && (
              <div className="col-span-full text-center text-red-500">
                {error}
              </div>
            )}
            {!isBusy && !error && !hasPosts && (
              <div className="col-span-full text-center text-gray-500">
                No posts available yet.
              </div>
            )}
            {!isBusy &&
              !error &&
              posts.map((item) => {
                const authorId = getAuthorId(item.author);

                return (
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
                        <button
                          type="button"
                          onClick={(event) =>
                            handleAuthorClick(event, authorId)
                          }
                          className="font-medium text-gray-700 hover:text-amber-600 focus:outline-none disabled:cursor-default disabled:text-gray-400"
                          disabled={!authorId}
                        >
                          {getAuthorName(item.author)}
                        </button>
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
                          {new Date(item.createdAt).toISOString().split("T")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
