import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';

const CATEGORIES = [
  { value: 'Politics & Power', label: 'Politics & Power', labelAm: 'ፖለቲካ እና ስልጣን' },
  { value: 'Law & Governance', label: 'Law & Governance', labelAm: 'ህግ እና አስተዳደር' },
  { value: 'Society & Ethics', label: 'Society & Ethics', labelAm: 'ማህበረሰብ እና ስነምግባር' },
];

export default function BlogsPage() {
  const { language } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus, filterCategory]);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);

      const response = await fetch(`/api/blogs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm(language === 'en' ? 'Are you sure?' : 'እርግጠኛ ነው?')) return;

    try {
      const response = await fetch(`/api/blogs/${slug}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setBlogs(blogs.filter((b) => b.slug !== slug));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout title="Blogs">
      <Head>
        <title>Blogs - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{t('blogs', language)}</h1>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/admin/blogs/new">
          <a className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {t('newBlog', language)}
          </a>
        </Link>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-select"
          style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #eeeef5' }}
        >
          <option value="">{language === 'en' ? 'All Status' : 'ሁሉም ሁኔታ'}</option>
          <option value="draft">{language === 'en' ? 'Draft' : 'ረቂቅ'}</option>
          <option value="published">{language === 'en' ? 'Published' : 'ታተመ'}</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-select"
          style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #eeeef5' }}
        >
          <option value="">{t('category', language)}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {language === 'en' ? cat.label : cat.labelAm}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <span>{t('loading', language)}</span>
        </div>
      ) : blogs.length > 0 ? (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('title', language)}</th>
                <th>{t('category', language)}</th>
                <th>{t('status', language)}</th>
                <th>{language === 'en' ? 'Actions' : 'ድርጊቶች'}</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.slug}>
                  <td>
                    <strong>
                      {language === 'en' ? blog.titleEn : blog.titleAm}
                    </strong>
                  </td>
                  <td>{blog.category}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          blog.status === 'published'
                            ? 'rgba(95, 195, 59, 0.1)'
                            : 'rgba(255, 171, 10, 0.1)',
                        color:
                          blog.status === 'published'
                            ? '#5fc33b'
                            : '#ffab0a',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {blog.status === 'published'
                        ? t('published', language)
                        : t('drafts', language)}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/blogs/${blog.slug}`}>
                      <a className="btn btn-secondary btn-icon" title="Edit">
                        <i className="fas fa-edit"></i>
                      </a>
                    </Link>
                    <button
                      className="btn btn-danger btn-icon"
                      onClick={() => handleDelete(blog.slug)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <div className="empty-icon">
            <i className="fas fa-inbox"></i>
          </div>
          <h3>{language === 'en' ? 'No Blogs' : 'ምንም ብሎግ የለም'}</h3>
        </div>
      )}
    </AdminLayout>
  );
}
