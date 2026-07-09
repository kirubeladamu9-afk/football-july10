import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/src/hooks/useLanguage";
import { getTranslatedField } from "@/src/utils/i18n";

const RecentPost = () => {
  const { language } = useLanguage();
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/blogs/public?limit=3');
        if (!response.ok) throw new Error('Failed to fetch recent posts');
        const data = await response.json();
        setRecentPosts(data.blogs);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="sidebar__widget mb-40">
        <div className="sidebar__widge-title-box">
          <h3 className="sidebar__widget-title">Recent Post</h3>
        </div>
        <div className="sidebar__widget-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sidebar__widget mb-40">
        <div className="sidebar__widge-title-box">
          <h3 className="sidebar__widget-title">Recent Post</h3>
        </div>
        <div className="sidebar__widget-content">
          <div className="sidebar__post rc__post">
            {recentPosts.map((item, i) => {
              const title = getTranslatedField(item, 'title', language);
              const date = new Date(item.createdAt).toLocaleDateString(
                language === 'am' ? 'am-ET' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );
              return (
                <div key={i} className="rc__post mb-20 d-flex">
                  <div className="rc__post-thumb mr-20">
                    <Link href={`/blog/${item.slug}`}>
                      <Image
                        src={item.coverImage || '/assets/img/blog/blog-list-avata-1.jpg'}
                        alt={title}
                        width={60}
                        height={60}
                      />
                    </Link>
                  </div>
                  <div className="rc__post-content">
                    <h3 className="rc__post-title">
                      <Link href={`/blog/${item.slug}`}>{title}</Link>
                    </h3>
                    <div className="rc__meta">
                      <span>{date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentPost;