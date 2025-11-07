import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ContentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // This would normally come from an API call
    const contentList = [
      {
        id: 1,
        title: "Getting Started with React",
        content:
          "React is a powerful JavaScript library for building user interfaces. It allows developers to create reusable components and manage application state efficiently. In this comprehensive guide, we will explore the fundamentals of React, including components, props, state management, and hooks. React's component-based architecture makes it easy to build and maintain complex applications. You can break down your UI into smaller, manageable pieces that can be reused throughout your application. This modular approach not only improves code organization but also enhances development productivity. Whether you're building a simple website or a complex web application, React provides the tools and flexibility you need to create amazing user experiences.",
        author: "John Doe",
        date: "2 days ago",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        category: "Tutorial",
        readTime: "5 min read",
        tags: ["React", "JavaScript", "Frontend"],
      },
      {
        id: 2,
        title: "Advanced TypeScript Patterns",
        content:
          "TypeScript has revolutionized the way we write JavaScript by adding static typing and advanced features. This article dives deep into advanced TypeScript patterns that can help you write more robust and maintainable code. We'll explore generics, conditional types, mapped types, and utility types. Understanding these patterns will elevate your TypeScript skills and make your codebase more type-safe. TypeScript's type system is incredibly powerful and can catch many errors at compile time rather than runtime. By leveraging advanced patterns, you can create flexible and reusable type definitions that work seamlessly across your entire application. We'll also look at real-world examples and best practices for implementing these patterns in your projects.",
        author: "Jane Smith",
        date: "5 days ago",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        category: "Advanced",
        readTime: "8 min read",
        tags: ["TypeScript", "Programming", "Best Practices"],
      },
      {
        id: 3,
        title: "Building Responsive Designs",
        content:
          "Creating responsive web designs is essential in today's multi-device world. This comprehensive guide covers everything you need to know about building websites that look great on any screen size. We'll explore mobile-first design principles, CSS Grid, Flexbox, and media queries. You'll learn how to create fluid layouts that adapt seamlessly to different viewport sizes. Responsive design isn't just about making things fit on smaller screens; it's about providing an optimal user experience across all devices. We'll discuss best practices for touch targets, readable typography, and performant images. By the end of this guide, you'll have the skills to create beautiful, responsive websites that work perfectly on smartphones, tablets, and desktop computers.",
        author: "Mike Johnson",
        date: "1 week ago",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        category: "Design",
        readTime: "6 min read",
        tags: ["CSS", "Responsive Design", "UI/UX"],
      },
      {
        id: 4,
        title: "Understanding API Integration",
        content:
          "APIs are the backbone of modern web applications, enabling communication between different services and systems. In this detailed tutorial, we'll explore how to effectively integrate APIs into your React applications. We'll cover RESTful APIs, authentication methods, error handling, and data management. You'll learn how to use fetch, axios, and other popular libraries to make HTTP requests. We'll also discuss best practices for handling loading states, error scenarios, and caching strategies. Understanding how to work with APIs is crucial for building dynamic, data-driven applications. Whether you're fetching data from a backend server, integrating third-party services, or building your own API, this guide will provide you with the knowledge and skills you need to succeed.",
        author: "Sarah Wilson",
        date: "3 days ago",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        category: "Backend",
        readTime: "7 min read",
        tags: ["API", "REST", "Integration"],
      },
      {
        id: 5,
        title: "CSS Grid vs Flexbox",
        content:
          "CSS Grid and Flexbox are two powerful layout systems that have transformed how we build web layouts. But when should you use one over the other? This in-depth comparison will help you understand the strengths and use cases of each. Flexbox is excellent for one-dimensional layouts, where you need to align items in a row or column. CSS Grid, on the other hand, excels at two-dimensional layouts, allowing you to control both rows and columns simultaneously. We'll explore practical examples of when to use each system and how they can work together. By understanding the unique capabilities of both Grid and Flexbox, you'll be able to choose the right tool for any layout challenge. We'll also cover common patterns and best practices for creating complex, responsive layouts.",
        author: "Alex Brown",
        date: "4 days ago",
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        category: "CSS",
        readTime: "10 min read",
        tags: ["CSS", "Grid", "Flexbox", "Layout"],
      },
      {
        id: 6,
        title: "Modern JavaScript Features",
        content:
          "JavaScript has evolved significantly over the years, with new features being added regularly through ECMAScript updates. This comprehensive guide explores the most important modern JavaScript features that every developer should know. We'll cover ES6+ syntax including arrow functions, destructuring, spread operators, template literals, and async/await. These features make your code more concise, readable, and maintainable. We'll also explore newer additions like optional chaining, nullish coalescing, and dynamic imports. Understanding these modern features will help you write cleaner, more efficient code and stay up-to-date with current JavaScript best practices. Each feature is explained with practical examples and use cases to help you apply them in your own projects.",
        author: "Emily Davis",
        date: "6 days ago",
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        category: "JavaScript",
        readTime: "9 min read",
        tags: ["JavaScript", "ES6+", "Modern Web"],
      },
    ];

    // Find the content by id
    const foundContent = contentList.find(
      (item) => item.id === parseInt(id || "0")
    );
    setContent(foundContent);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!content) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Content not found
          </h2>
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
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                {content.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg
                  className="w-4 h-4"
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
                {content.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {content.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {content.author
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {content.author}
                  </p>
                  <p className="text-xs text-gray-500">{content.date}</p>
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
                {content.tags.map((tag: string, index: number) => (
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
