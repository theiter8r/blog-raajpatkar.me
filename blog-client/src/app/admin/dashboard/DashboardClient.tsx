'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAdminToken,
  getAdminUser,
  adminLogout,
  getAdminPost,
  getAdminPosts,
  createPost,
  updatePost,
  publishPost,
} from '@/lib/api';
import type { Post, PostListItem, CreatePostRequest } from '@/lib/types';
import Button from '@/components/Button';

type View = 'list' | 'create' | 'edit';

export default function DashboardClient() {
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const user = getAdminUser();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminPosts(1, 100);
      setPosts(data.posts);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin/login');
      return;
    }
    fetchPosts();
  }, [router, fetchPosts]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleCreate = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: CreatePostRequest = { title, content };
      if (excerpt) payload.excerpt = excerpt;
      if (publishNow) payload.status = 'published';
      await createPost(payload);
      setSuccess(
        publishNow
          ? 'Post published! Newsletter is being sent to subscribers.'
          : 'Post created successfully!'
      );
      resetForm();
      setView('list');
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      await updatePost(editingId, { title, content, excerpt: excerpt || undefined });
      setSuccess('Post updated successfully!');
      resetForm();
      setView('list');
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishPost(id);
      setSuccess('Post published!');
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    }
  };

  const startEdit = async (post: PostListItem) => {
    setError('');
    setSuccess('');
    try {
      const full = await getAdminPost(post.id);
      setEditingId(full.id);
      setTitle(full.title);
      setExcerpt(full.excerpt || '');
      setContent(full.content);
      setView('edit');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    }
  };

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Header bar */}
      <header className="border-b border-border-primary bg-surface-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl text-primary">Dashboard</h1>
            {user && (
              <span className="text-xs text-tertiary bg-surface-secondary px-2.5 py-1 rounded-full border border-border-primary">
                {user.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {view === 'list' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => { resetForm(); setView('create'); }}
              >
                New Post
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => { resetForm(); setView('list'); }}
              >
                &larr; Back
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Notifications */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20 px-5 py-3 text-sm text-red-700 dark:text-red-400 animate-fade-in">
            {error}
            <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-600">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20 px-5 py-3 text-sm text-green-700 dark:text-green-400 animate-fade-in">
            {success}
            <button onClick={() => setSuccess('')} className="float-right text-green-400 hover:text-green-600">&times;</button>
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-2xl text-primary mb-6">Posts</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-border-primary bg-surface-secondary p-5 animate-pulse">
                    <div className="h-4 w-1/3 bg-surface-primary rounded mb-3" />
                    <div className="h-3 w-1/5 bg-surface-primary rounded" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-tertiary">
                <p className="text-lg mb-2">No posts yet</p>
                <p className="text-sm">Click &quot;New Post&quot; to write your first article.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, i) => (
                  <div
                    key={post.id}
                    className="group rounded-xl border border-border-primary bg-surface-secondary/50 hover:bg-surface-secondary p-5 transition-all duration-200"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-primary group-hover:text-accent transition-colors truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                            post.published_at
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {post.published_at ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs text-tertiary">
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </span>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-secondary mt-2 line-clamp-1">{post.excerpt}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(post)}>
                          Edit
                        </Button>
                        {!post.published_at && (
                          <Button variant="primary" size="sm" onClick={() => handlePublish(post.id)}>
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create / Edit form */}
        {(view === 'create' || view === 'edit') && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-2xl text-primary mb-6">
              {view === 'create' ? 'New Post' : 'Edit Post'}
            </h2>
            <form onSubmit={view === 'create' ? handleCreate : handleUpdate} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-brand-border-dark bg-brand-bg-dark px-4 py-3 text-brand-text-dark placeholder:text-brand-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all"
                  placeholder="Post title..."
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-secondary mb-2">
                  Excerpt <span className="text-tertiary font-normal">(optional)</span>
                </label>
                <input
                  id="excerpt"
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-xl border border-brand-border-dark bg-brand-bg-dark px-4 py-3 text-brand-text-dark placeholder:text-brand-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all"
                  placeholder="Brief summary..."
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-secondary mb-2">
                  Content <span className="text-tertiary font-normal">(Markdown)</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required={view === 'create'}
                  rows={20}
                  className="w-full rounded-xl border border-brand-border-dark bg-brand-bg-dark px-4 py-3 text-brand-text-dark placeholder:text-brand-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all font-mono text-sm leading-relaxed resize-y"
                  placeholder="Write your post in Markdown..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : view === 'create' ? 'Save as Draft' : 'Update Post'}
                </Button>
                {view === 'create' && (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={saving}
                    onClick={(e) => handleCreate(e as unknown as React.FormEvent, true)}
                    className="!bg-green-600 hover:!bg-green-700"
                  >
                    {saving ? 'Publishing...' : 'Create & Publish'}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="default"
                  onClick={() => { resetForm(); setView('list'); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}