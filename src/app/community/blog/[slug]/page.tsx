import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import BlogComments from '@/components/BlogComments';

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, ['title', 'excerpt', 'coverImage']);

  if (!post.title) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Our Community`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, [
    'title',
    'date',
    'author',
    'content',
    'category',
    'coverImage'
  ]);

  if (!post.content) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10 text-center">
        <div className="mb-4">
          <span className="uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 text-sm">
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
          <span className="mr-4">By {post.author}</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-blue mt-8">
        <MDXRemote source={post.content} />
      </div>

      {/* Supabase Comments and Likes Section */}
      <BlogComments postSlug={slug} />
    </article>
  );
}
