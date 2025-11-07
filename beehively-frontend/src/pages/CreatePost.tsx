import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [status, setStatus] = useState('draft')
    const [tags, setTags] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formattedTags = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)

        console.log('Post submitted', {
            title,
            content,
            status,
            tags: formattedTags
        })

        alert('Post submitted (demo)')
        navigate('/profile')
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Create New Post</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill the form below with your post details. Keep it simple and clear.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                            placeholder="Post title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="content">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                            placeholder="Write everything you want to share"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tags">
                                Tags
                            </label>
                            <input
                                id="tags"
                                type="text"
                                value={tags}
                                onChange={(event) => setTags(event.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                                placeholder="Example: design, tutorial"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-2 text-sm font-medium"
                        >
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
