import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBlogBySlug } from '../lib/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  slug: string;
}
export default function BlogDetail() {
  const { blogId } = useParams<{ blogId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        setLoading(false);
        return;
      }
      try {
        const blog = await getBlogBySlug(blogId);
        setPost(blog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96 overflow-hidden">
            <img
              src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${post.image}`}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=Blog+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block bg-brand-purple text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <span>•</span>
                <span>{post.readTime || '5 min read'}</span>
                <span>•</span>
                <span>By {post.author || 'Flownetics Team'}</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              <div
                className="blog-content text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 font-semibold text-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Articles
          </Link>
        </div>
      </div>

      <style>{`
        .blog-content h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-content h4 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #2a2a2a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
        }
        .blog-content ul {
          margin-bottom: 1.5rem;
          margin-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.75rem;
          list-style-type: disc;
          padding-left: 0.5rem;
        }
        .blog-content strong {
          color: #1a1a1a;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
