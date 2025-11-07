import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
            <div className="text-center space-y-8 animate-fade-in max-w-2xl">
            <div className="space-y-4">
                {/* 404 illustration */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            404
                        </div>
                        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-pink-500 opacity-20 -z-10"></div>
                    </div>
                </div>

                {/* Error message */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Page Not Found</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-4">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 px-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                    >
                        Go to Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 rounded-xl bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-300 hover:scale-105"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto px-4">
                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/')}>
                    <svg className="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <p className="text-xs text-gray-600 font-medium">Home</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/login')}>
                    <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <p className="text-xs text-gray-600 font-medium">Login</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/signup')}>
                    <svg className="w-8 h-8 mx-auto mb-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <p className="text-xs text-gray-600 font-medium">Sign Up</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => window.location.reload()}>
                    <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-xs text-gray-600 font-medium">Refresh</p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default NotFound

