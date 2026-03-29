import { Post, PostList } from 'src/types/post.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export interface BlogListConfig {
  page?: number | string
  limit?: number | string
  category?: string
  search?: string
  sort_by?: 'createdAt' | 'title' | 'views'
  order?: 'asc' | 'desc'
}

const blogApi = {
  // Get published posts for public blog listing
  getPosts(params?: BlogListConfig) {
    return http.get<SuccessResponse<PostList>>('/posts', { params })
  },

  // Get published post by slug for blog detail page
  getPost(slug: string) {
    return http.get<SuccessResponse<Post>>(`/posts/${slug}`)
  }
}

export default blogApi