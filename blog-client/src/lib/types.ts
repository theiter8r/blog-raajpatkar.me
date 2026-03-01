export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  html_content: string;
  status: 'draft' | 'published';
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PostsResponse {
  posts: PostListItem[];
  pagination: Pagination;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
}

export interface SubscribeRequest {
  email: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
