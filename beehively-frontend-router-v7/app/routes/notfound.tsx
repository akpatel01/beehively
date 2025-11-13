import { useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
            <div className="text-center space-y-8 animate-fade-in max-w-2xl">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                404
                            </div>
                            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 to-pink-500 opacity-20 -z-10"></div>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                        Page Not Found
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto px-4">
                        Oops! The page you're looking for doesn't exist. It might have been
                        moved or deleted.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 px-4">
                        <button
                            onClick={() => navigate("/")}
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
            </div>
        </div>
    );
}
