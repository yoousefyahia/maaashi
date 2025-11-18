import React from 'react'
import './blog.css';
import AboutUsChoice from '../../Components/AboutUsChoice/AboutUsChoice';
import BlogCard from '../../Components/BlogCard/BlogCard';

export default function Blog() {
  return (
    <div className='blog_container'>
      <section className="hero">
        <div className="overlay">
          <div className="content">
            <div className="tags">
              <span className="tag">السيارات</span>
              <span className="tag">مقالات</span>
            </div>
            <h1 className="title">
              حماية السيارة بالسيراميك؟ ليه لازم تحمي عربيتك
            </h1>
          </div>
        </div>
      </section>
      <BlogCard />
      <AboutUsChoice />
    </div>
  )
};