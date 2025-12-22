import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getBlogs } from '../lib/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  slug: string;
}

export default function Blog() {
  const ref = useScrollReveal<HTMLDivElement>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await getBlogs();
        setBlogPosts(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(updateScrollButtons, 300);
    }
  };

  return (
    <section id="blog" className="py-16 px-6 bg-gradient-to-b from-white to-brand-light relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-3xl"></div>

      <div ref={ref} className="max-w-7xl mx-auto relative z-10 reveal-on-scroll">
        <div className="text-center mb-8">
          <span className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-3 block">
            Insights & Updates
          </span>
          <div className="inline-block mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green blur-lg opacity-30"></div>
              <h2 className="relative text-3xl md:text-4xl font-semibold tracking-tighter bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent">
                Latest from Our Blog.
              </h2>
            </div>
          </div>
          <p className="text-brand-gray text-base max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and innovations in continuous flow chemistry.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'opacity-100 hover:bg-brand-purple hover:text-white cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all ${
              canScrollRight
                ? 'opacity-100 hover:bg-brand-purple hover:text-white cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={updateScrollButtons}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-brand-gray">Loading blogs...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-brand-gray">No blogs available yet.</p>
              </div>
            ) : (
              blogPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="flex-none w-[320px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${post.image}`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x144?text=Blog+Image';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-brand-purple text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-brand-gray mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-base font-semibold text-brand-black mb-2 group-hover:text-brand-purple transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-brand-gray text-xs mb-3 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-brand-purple font-medium text-xs group-hover:gap-3 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
              ))
            )}
          </div>
        </div>

        <div className="text-center mt-8">
         
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
