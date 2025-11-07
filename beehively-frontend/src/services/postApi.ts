import apiClient, { extractAxiosErrorMessage } from './apiClient'

export type Post = {
    _id: string
    title: string
    content: string
    status: 'draft' | 'published' | 'archived'
    tags: string[]
    author:
    | {
        _id?: string
        name?: string
        email?: string
    }
    | string
    | null
    createdAt: string
    updatedAt: string
}

type CreatePostPayload = {
    title: string
    content: string
    status: 'draft' | 'published' | 'archived'
    tags?: string[]
}

type CreatePostResponse = {
    message: string
    post: Post
}

type ListPostsResponse = {
    message: string
    posts: Post[]
}

export const createPost = async (payload: CreatePostPayload) => {
    try {
        const { data } = await apiClient.post<CreatePostResponse>('/posts/create-post', payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const listPosts = async (params?: { status?: Post['status']; author?: string }) => {
    try {
        const { data } = await apiClient.get<ListPostsResponse>('/posts/get-posts', { params })
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

