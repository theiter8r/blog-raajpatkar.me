import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './constants';
import type {
  PostsResponse,
  Post,
  AdminLoginRequest,
  AdminLoginResponse,
  CreatePostRequest,
  UpdatePostRequest,
  SubscribeRequest,
} from './types';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token for admin requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize error responses
function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
  throw error;
}

// ─── Public Posts ──────────────────────────────────────────────

export async function getPosts(page = 1, limit = 10): Promise<PostsResponse> {
  try {
    const { data } = await api.get<PostsResponse>('/posts', {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const { data } = await api.get<Post>(`/posts/${slug}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

// ─── Newsletter ───────────────────────────────────────────────

export async function subscribe(email: string): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>('/subscribe', { email } as SubscribeRequest);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

// ─── Admin Auth ───────────────────────────────────────────────

export async function adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
  try {
    const { data } = await api.post<AdminLoginResponse>('/admin/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
    }
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export function adminLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
}

export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export function getAdminUser(): { id: string; email: string; name: string } | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('admin_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        localStorage.removeItem('admin_user');
        return null;
      }
    }
  }
  return null;
}

// ─── Admin Posts ──────────────────────────────────────────────

export async function getAdminPost(id: string): Promise<Post> {
  try {
    const { data } = await api.get<Post>(`/admin/posts/${id}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAdminPosts(page = 1, limit = 100): Promise<PostsResponse> {
  try {
    const { data } = await api.get<PostsResponse>('/admin/posts', {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function createPost(post: CreatePostRequest): Promise<Post> {
  try {
    const { data } = await api.post<Post>('/admin/posts', post);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updatePost(id: string, post: UpdatePostRequest): Promise<Post> {
  try {
    const { data } = await api.put<Post>(`/admin/posts/${id}`, post);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function publishPost(id: string): Promise<{ message: string; post: Post }> {
  try {
    const { data } = await api.post<{ message: string; post: Post }>(`/admin/posts/${id}/publish`);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export default api;
