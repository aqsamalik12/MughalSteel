import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { blogs } = useData();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Design Trends', 'Technology', 'Style Guides'];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogs[0] || { id: 'empty', title: 'No posts yet', slug: '', excerpt: '', date: '', author: '', featuredImage: '', content: '', category: '' };
  const gridPosts = filteredBlogs.filter(b => b.id !== featuredPost.id || searchQuery || selectedCategory !== 'All');

  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em]">IronCraft Editorial</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-100 uppercase tracking-widest">
            Design & Architecture Blog
          </h1>
          <p className="text-stone-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Professional insights into luxury steel door trends, structural thermal break engineering, and entry style selectors.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-brand-light pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 order-last md:order-first">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-[10px] tracking-wider font-semibold uppercase border transition-all duration-300 ${selectedCategory === cat ? 'bg-brand-gold border-brand-gold text-brand-dark' : 'bg-transparent border-stone-850 text-stone-400 hover:text-brand-gold hover:border-brand-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-brand-medium border border-brand-light text-stone-200 px-3 py-2 pl-9 text-xs focus:outline-none focus:border-brand-gold rounded"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-500" />
          </div>
        </div>

        {/* Featured Post (only shown when no query/category filter active) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div className="border border-brand-light bg-brand-medium/20 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded items-center">
            <div className="lg:col-span-7 aspect-[16/10] bg-brand-dark overflow-hidden border border-brand-light/60">
              <img 
                src={featuredPost.featuredImage} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                Featured Article
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-stone-100 uppercase tracking-wide leading-tight">
                <Link to={`/blog/${featuredPost.slug}`} className="hover:text-brand-gold transition-colors">
                  {featuredPost.title}
                </Link>
              </h2>
              
              <div className="flex items-center space-x-4 text-[10px] text-stone-450 uppercase tracking-widest">
                <span className="flex items-center space-x-1"><User className="w-3.5 h-3.5 text-brand-gold" /> <span>{featuredPost.author}</span></span>
                <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 text-stone-600" /> <span>{featuredPost.date}</span></span>
              </div>

              <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2">
                <Link 
                  to={`/blog/${featuredPost.slug}`}
                  className="btn-gold text-[10px] inline-flex items-center space-x-2"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Grid */}
        <div>
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <div key={post.id} className="border border-brand-light bg-brand-medium flex flex-col h-full rounded shadow-premium hover:shadow-premium-hover transition-all duration-300">
                  <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-brand-dark border-b border-brand-light">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] text-stone-500 uppercase tracking-widest">
                        <span>{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-serif text-lg text-stone-200 hover:text-brand-gold transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-stone-400 text-[11px] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-brand-light/30 flex items-center justify-between">
                      <span className="text-[9px] text-stone-500 flex items-center space-x-1">
                        <User className="w-3 h-3 text-brand-gold" />
                        <span className="truncate max-w-[120px]">{post.author}</span>
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="text-[10px] text-brand-gold font-bold uppercase tracking-widest hover:text-stone-200 transition-colors"
                      >
                        Read More &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500 text-sm">
              No articles found matching your criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default BlogPage;
