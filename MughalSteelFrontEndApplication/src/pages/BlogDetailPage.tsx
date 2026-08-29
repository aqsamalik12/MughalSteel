import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { User, Calendar, ArrowLeft, Send } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs } = useData();
  const navigate = useNavigate();
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });
  const [comments, setComments] = useState<{ name: string; text: string; date: string }[]>([
    { name: 'Sarah Conner', text: 'Very insightful read. We are sizing for our pivot door now and this structural header tip is exactly what our builder needed to know.', date: '2026-07-16' }
  ]);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const post = blogs.find(b => b.slug === slug);

  if (!post) {
    return (
      <div className="bg-brand-dark min-h-screen text-stone-200 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif mb-4 text-brand-gold">Article Not Found</h1>
        <p className="text-stone-400 text-sm mb-6">The design article you are trying to view does not exist or has been archived.</p>
        <Link to="/blog" className="btn-gold text-[10px]">Return to Editorial</Link>
      </div>
    );
  }

  const relatedPosts = blogs.filter(b => post.relatedPosts?.includes(b.slug));

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentForm.name.trim() && commentForm.comment.trim()) {
      setComments([
        ...comments,
        {
          name: commentForm.name,
          text: commentForm.comment,
          date: new Date().toISOString().split('T')[0]
        }
      ]);
      setCommentForm({ name: '', comment: '' });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    }
  };

  return (
    <div className="bg-brand-dark min-h-screen text-stone-200 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-stone-450 hover:text-brand-gold text-xs uppercase tracking-widest font-bold transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editorial</span>
        </button>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20 inline-block">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-100 uppercase tracking-wide leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[10px] text-stone-450 uppercase tracking-widest border-y border-brand-light/50 py-3">
            <span className="flex items-center space-x-1.5"><User className="w-4 h-4 text-brand-gold" /> <span>{post.author}</span></span>
            <span className="flex items-center space-x-1.5"><Calendar className="w-4 h-4 text-stone-600" /> <span>Published on {post.date}</span></span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full bg-brand-dark overflow-hidden border border-brand-light/75">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Content */}
        <article 
          className="prose prose-invert max-w-none text-stone-300 text-xs md:text-sm leading-relaxed space-y-6 pt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Feed */}
        <div className="border-t border-brand-light/60 pt-10 space-y-8">
          <h3 className="text-lg font-serif text-stone-200 uppercase tracking-wider">Comments ({comments.length})</h3>
          
          <div className="space-y-4">
            {comments.map((c, idx) => (
              <div key={idx} className="bg-brand-medium/40 border border-brand-light/30 p-5 rounded space-y-2">
                <div className="flex justify-between items-center text-[10px] text-stone-500 uppercase tracking-widest font-bold">
                  <span>{c.name}</span>
                  <span>{c.date}</span>
                </div>
                <p className="text-stone-350 text-xs leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Post a Comment Form */}
          <form onSubmit={handlePostComment} className="bg-brand-medium border border-brand-light p-6 rounded space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-200">Share Your Thoughts</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-stone-400 uppercase tracking-widest mb-1 font-bold">Name *</label>
                <input 
                  type="text"
                  required
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-light text-xs px-3 py-2 text-stone-200 focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-stone-400 uppercase tracking-widest mb-1 font-bold">Comment *</label>
              <textarea 
                rows={3}
                required
                value={commentForm.comment}
                onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                className="w-full bg-brand-dark border border-brand-light text-xs px-3 py-2 text-stone-200 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button 
              type="submit"
              className="btn-gold text-[9px] font-bold tracking-widest uppercase flex items-center space-x-1.5 px-5 py-2.5"
            >
              <span>Submit Comment</span>
              <Send className="w-3 h-3" />
            </button>
            
            {commentSuccess && (
              <p className="text-[10px] text-brand-gold animate-pulse font-medium">Your comment has been added successfully.</p>
            )}
          </form>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-brand-light/60 pt-10 space-y-6">
            <h3 className="text-lg font-serif text-stone-200 uppercase tracking-widest">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(p => (
                <div key={p.id} className="bg-brand-medium border border-brand-light/50 p-4 rounded flex space-x-3 items-center">
                  <img src={p.featuredImage} alt={p.title} className="w-20 h-16 object-cover border border-brand-light" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] text-brand-gold font-bold uppercase tracking-wider">{p.category}</span>
                    <h4 className="font-serif text-sm text-stone-250 truncate hover:text-brand-gold transition-colors mt-0.5">
                      <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-1">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default BlogDetailPage;
