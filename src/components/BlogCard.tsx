import Link from 'next/link';

type BlogCardProps = {
  post: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    category: string;
    author: string;
  };
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-black">
      <div className="p-6">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">{post.category}</span>
          <span>{post.date}</span>
        </div>
        <Link href={`/community/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
          <span>By {post.author}</span>
        </div>
      </div>
    </div>
  );
}
