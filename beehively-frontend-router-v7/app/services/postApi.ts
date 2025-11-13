import apiClient, { extractAxiosErrorMessage } from './apiClient'

export type Post = {
    _id: string
    title: string
    content: string
    status: 'draft' | 'published' | 'archived'
    tags: string[]
    deletedAt?: string | null
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

type UpdatePostPayload = {
    title?: string
    content?: string
    status?: Post['status']
    tags?: string[]
}

type UpdatePostResponse = {
    message: string
    post: Post
}

type DeletePostResponse = {
    message: string
    postId?: string
}

type GetPostResponse = {
    message: string
    post: Post
}

type BulkDeletePayload = {
    ids: string[]
}

type BulkDeleteResponse = {
    message: string
    deletedIds: string[]
}

type RestorePostsPayload = {
    ids: string[]
}

type RestorePostsResponse = {
    message: string
    restoredIds: string[]
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

export const updatePost = async (id: string, payload: UpdatePostPayload) => {
    try {
        const { data } = await apiClient.put<UpdatePostResponse>(`/posts/update-post/${id}`, payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const deletePost = async (id: string) => {
    try {
        const { data } = await apiClient.delete<DeletePostResponse>(`/posts/delete-post/${id}`)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const getPostById = async (id: string) => {
    try {
        const { data } = await apiClient.get<GetPostResponse>(`/posts/get-post/${id}`)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const bulkDeletePosts = async (payload: BulkDeletePayload) => {
    try {
        const { data } = await apiClient.post<BulkDeleteResponse>('/posts/bulk-delete', payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const restorePosts = async (payload: RestorePostsPayload) => {
    try {
        const { data } = await apiClient.post<RestorePostsResponse>('/posts/restore-posts', payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}
