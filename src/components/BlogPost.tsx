import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface BlogPostProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogPost({ post, featured = false }: BlogPostProps) {
  return (
    <article className={`bg-white rounded-xl shadow-md overflow-hidden ${featured ? 'md:col-span-2 md:grid md:grid-cols-2 md:items-center' : ''}`}>
      <div className={`relative ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {post.readTime}
          </span>
        </div>
        <div className="flex gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
        <h3 className={`font-bold text-gray-900 mb-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{post.author}</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
}