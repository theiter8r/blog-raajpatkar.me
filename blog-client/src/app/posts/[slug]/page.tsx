import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/api';
import PostContent from './PostContent';
import { SITE_NAME, SITE_URL } from '@/lib/constants';


interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    const description = post.excerpt || post.content.slice(0, 160);

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        url: `${SITE_URL}/posts/${post.slug}`,
        siteName: SITE_NAME,
        type: 'article',
        publishedTime: post.published_at || undefined,
        modifiedTime: post.updated_at,
        images: [
          {
            url: `${SITE_URL}/api/og/${post.slug}`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [`${SITE_URL}/api/og/${post.slug}`],
      },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts(1, 100);
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    return <PostContent post={post} />;
  } catch {
    notFound();
  }
}
