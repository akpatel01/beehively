import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Home = () => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState('newest')

    // This would normally come from an API call
    const contentList = [
        {
            id: 1,
            title: 'Getting Started with React',
            content: 'Learn the fundamentals of React including components, props, state management, and hooks. This comprehensive guide will help you build your first React application from scratch.',
            author: 'Sarah Chen',
            date: '2 days ago',
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
        },
        {
            id: 2,
            title: 'The Future of Web Development',
            content: 'Explore emerging trends and technologies shaping the future of web development. From AI integration to progressive web apps, discover what\'s next in the industry.',
            author: 'Mike Johnson',
            date: '5 days ago',
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
        },
        {
            id: 3,
            title: 'Design Systems Best Practices',
            content: 'Building scalable design systems requires careful planning and execution. Learn how to create consistent, maintainable design patterns for your organization.',
            author: 'Emma Wilson',
            date: '1 week ago',
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
        },
        {
            id: 4,
            title: 'Mastering TypeScript',
            content: 'Deep dive into TypeScript advanced features including generics, decorators, and type guards. Enhance your code quality and catch errors before runtime.',
            author: 'David Park',
            date: '1 week ago',
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
        },
        {
            id: 5,
            title: 'UI/UX Trends 2024',
            content: 'Stay ahead with the latest UI/UX design trends. From micro-interactions to immersive experiences, see what\'s capturing user attention this year.',
            author: 'Lisa Anderson',
            date: '2 weeks ago',
            timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000
        },
        {
            id: 6,
            title: 'Building Scalable APIs',
            content: 'Best practices for designing and implementing RESTful APIs that can handle millions of requests. Learn about authentication, rate limiting, and caching strategies.',
            author: 'James Smith',
            date: '2 weeks ago',
            timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000
        }
    ]

    // Function to sort the content
    const getSortedContent = () => {
        const sorted = [...contentList]
        
        if (sortBy === 'newest') {
            sorted.sort((a, b) => b.timestamp - a.timestamp)
        } else if (sortBy === 'oldest') {
            sorted.sort((a, b) => a.timestamp - b.timestamp)
        } else if (sortBy === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title))
        }
        
        return sorted
    }

    const sortedContent = getSortedContent()

    // Handle button clicks for navigation
    return (
        <div className="min-h-[calc(100vh-80px)]">
            {/* Content Section */}
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

                        {/* Sorting buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <span className="text-sm font-medium text-gray-600">Sort by:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortBy('newest')}
                                    className={sortBy === 'newest' 
                                        ? 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                >
                                    Newest First
                                </button>
                                <button
                                    onClick={() => setSortBy('oldest')}
                                    className={sortBy === 'oldest'
                                        ? 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                >
                                    Oldest First
                                </button>
                                <button
                                    onClick={() => setSortBy('title')}
                                    className={sortBy === 'title'
                                        ? 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                >
                                    A-Z Title
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid of content cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {sortedContent.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => navigate(`/content/${item.id}`)}
                                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col"
                            >
                                {/* Card title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                    {item.title}
                                </h3>

                                {/* Content preview (max 2 lines) */}
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                                    {item.content}
                                </p>

                                {/* Bottom section with author and date */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                    {/* Author info */}
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="font-medium text-gray-700">{item.author}</span>
                                    </div>
                                    {/* Date info */}
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

