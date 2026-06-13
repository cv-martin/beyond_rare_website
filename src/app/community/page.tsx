import { getAllPosts } from '@/lib/mdx';
import BlogCard from '@/components/BlogCard';

export const metadata = {
  title: 'Our Community | Blog',
  description: 'Join the conversation in our community blog.',
};

export default function CommunityPage() {
  const posts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category',
  ]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Our Community</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Read our latest articles, insights, and updates from the team and community members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
