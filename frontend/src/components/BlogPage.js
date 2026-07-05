import React, { useEffect, useState } from "react";
import noimg from '../images/noimg.png'
import '../styles/input.css'
import { apiUrl } from '../utils/api';

const BlogCard = ({ blog, noimg, truncateContent }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md blog-post">
      <div className="flex justify-center items-center">
        {blog.image ? (
          <img className="w-full max-h-[300px] h-auto object-cover" src={blog.image} alt="" />
        ) : (
          <img src={noimg} alt="" />
        )}
      </div>
      <h2 className="mt-6 text-2xl font-sans font-bold mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-600">By: {blog.author} • {new Date(blog.publishedAt).toLocaleDateString()} • {blog.category} • {blog.readTime}</p>
      <p className="mt-2 text-gray-700 mb-4">{open ? blog.content : truncateContent((blog.content || blog.description || '').slice(0, 180))}</p>
      <button onClick={() => setOpen(!open)} className="text-green-600">{open ? 'Show Less' : 'Read More'}</button>
    </div>
  )
}

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('')
  const [bad, setBad] = useState(false)
  const [category, setCategory] = useState('All')

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl(`/api/blogs?q=${encodeURIComponent(query)}`))
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      setBlogs(json || []);
      setBad((json || []).length === 0);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(apiUrl('/api/blogs'));
        if (!response.ok) throw new Error('Failed to load blogs');
        const data = await response.json();
        setBlogs(data || []);
        setBad((data || []).length === 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateContent = (content) => {
    const truncatedContent = content.replace(/\.{3}.*$/, '...');
    return truncatedContent;
  };

  const renderBlogPosts = () => {
    return (
      <div>
        <form onSubmit={handlesubmit} className="mb-6 flex gap-3 items-center" >
          <div className="input-container flex-1">
            <input onChange={e => setQuery(e.target.value)} type="text" name="text" className="input" placeholder="Search by title or description..." />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 rounded">
            <option>All</option>
            <option>Nutrition</option>
            <option>Fitness</option>
            <option>Mental Health</option>
            <option>Women's Health</option>
            <option>Child Care</option>
            <option>Heart Health</option>
            <option>Diabetes</option>
            <option>Lifestyle</option>
            <option>Medical News</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Search</button>
        </form>
       
        { bad ? (
          <div className="w-full h-full flex justify-center items-center"> No Blogs found</div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              <div>Loading...</div>
            ) : (
              blogs
                .filter(b => category === 'All' ? true : b.category === category)
                .filter(b => !query ? true : ((b.title || '').toLowerCase().includes(query.toLowerCase()) || (b.description || '').toLowerCase().includes(query.toLowerCase())))
                .map((blog) => (
                  <BlogCard key={blog._id} blog={blog} noimg={noimg} truncateContent={truncateContent} />
                ))
            )}
          </div>
        )}
        
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen overflow-auto">
      <div className="container mx-auto mt-8 grid gap-8">
        {renderBlogPosts()}
      </div>
    </div>
  );
};

export default Blog;
