import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';

const PILLARS = [
  { value: 'politics', label_en: 'Politics & Power', label_am: 'ፖለቲካ እና ኃይል' },
  { value: 'law', label_en: 'Law & Governance', label_am: 'ህግ እና አስተዳደር' },
  { value: 'society', label_en: 'Society & Ethics', label_am: 'ህብረተ-ሰብ እና ስነ-ምግባር' },
];

export default function BlogsList() {
  const { t, language } = useAdminLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', category: '', page: 1 });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.category) params.append('category', filter.category);
      params.append('page', filter.page);
      params.append('limit', 20);

      const response = await fetch(`/api/admin/blogs?${params}`);
      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  const getPillarLabel = (value) => {
    const pillar = PILLARS.find((p) => p.value === value);
    return pillar ? (language === 'en' ? pillar.label_en : pillar.label_am) : value;
  };

  const getStatusLabel = (status) => {
    if (status === 'published') return t('published');
    if (status === 'draft') return t('draft');
    if (status === 'scheduled') return t('publishDate');
    return status;
  };

  return (
    <AdminLayout>
      <div className="admin-blogs-page">
        <div className="admin-header">
          <h1 className="admin-header-title">{t('blogs')}</h1>
          <Link href="/admin/blogs/create">
            <a className="admin-btn admin-btn-primary">{t('addArticle')}</a>
          </Link>
        </div>

        <div className="blogs-filters">
          <select
            className="filter-select"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
          >
            <option value="">{t('status')} - All</option>
            <option value="published">{t('published')}</option>
            <option value="draft">{t('draft')}</option>
            <option value="scheduled">{t('scheduled')}</option>
          </select>

          <select
            className="filter-select"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value, page: 1 })}
          >
            <option value="">{t('category')} - All</option>
            {PILLARS.map((p) => (
              <option key={p.value} value={p.value}>
                {language === 'en' ? p.label_en : p.label_am}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">📭</div>
            <h3>{t('noData')}</h3>
            <p>{language === 'en' ? 'No articles found' : 'ምንም መጣጥፍ አልተገኘም'}</p>
            <Link href="/admin/blogs/create">
              <a className="admin-btn admin-btn-primary">{t('addArticle')}</a>
            </Link>
          </div>
        ) : (
          <div className="blogs-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('title')}</th>
                  <th>{t('category')}</th>
                  <th>{t('status')}</th>
                  <th>{t('created')}</th>
                  <th>{language === 'en' ? 'Actions' : 'ተግባራት'}</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="blog-title">
                      {language === 'en' ? blog.title_en : blog.title_am}
                    </td>
                    <td>{blog.category ? getPillarLabel(blog.category) : '-'}</td>
                    <td>
                      <span className={`status-badge status-${blog.status}`}>
                        {getStatusLabel(blog.status)}
                      </span>
                    </td>
                    <td className="blog-date">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="blog-actions">
                      <Link href={`/admin/blogs/${blog.id}/edit`}>
                        <a className="action-btn edit-btn">{language === 'en' ? '✏️' : '✏️'}</a>
                      </Link>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(blog.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.pages > 1 && (
              <div className="pagination-controls">
                <button
                  disabled={filter.page === 1}
                  onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                  className="pagination-btn"
                >
                  ←
                </button>
                <span className="pagination-info">
                  {language === 'en' ? `Page ${filter.page} of ${pagination.pages}` : `ገጽ ${filter.page} ከ ${pagination.pages}`}
                </span>
                <button
                  disabled={filter.page === pagination.pages}
                  onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                  className="pagination-btn"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-blogs-page {
          padding: 0;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e4;
        }

        .admin-header-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          font-family: 'Noto Sans Ethiopic', sans-serif;
        }

        .admin-btn {
          display: inline-block;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
        }

        .admin-btn-primary {
          background-color: #2e5aac;
          color: white;
        }

        .admin-btn-primary:hover {
          background-color: #1a3a6b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 90, 172, 0.3);
        }

        .blogs-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e5e5e4;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          background-color: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #2e5aac;
          box-shadow: 0 0 0 3px rgba(46, 90, 172, 0.1);
        }

        .blogs-table-container {
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          overflow: hidden;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Inter', sans-serif;
        }

        .admin-table thead {
          background-color: #f3f3f2;
          border-bottom: 2px solid #e5e5e4;
        }

        .admin-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #1a1a1a;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e5e4;
          font-size: 14px;
          color: #333333;
        }

        .admin-table tr:hover {
          background-color: #f9f9f8;
        }

        .blog-title {
          font-weight: 500;
          color: #1a1a1a;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-published {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .status-draft {
          background-color: rgba(102, 102, 102, 0.1);
          color: #666666;
        }

        .status-scheduled {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ff9800;
        }

        .blog-date {
          color: #999999;
          font-size: 13px;
        }

        .blog-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 4px 8px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .action-btn:hover {
          background-color: #f3f3f2;
        }

        .delete-btn:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-top: 1px solid #e5e5e4;
        }

        .pagination-btn {
          padding: 6px 12px;
          border: 1px solid #e5e5e4;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #2e5aac;
          color: white;
          border-color: #2e5aac;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 14px;
          color: #666666;
        }

        .admin-loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
        }

        .admin-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(46, 90, 172, 0.2);
          border-top-color: #2e5aac;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .admin-empty-state {
          text-align: center;
          padding: 48px 24px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          color: #666666;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .admin-empty-state h3 {
          margin: 0 0 8px 0;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
        }

        .admin-empty-state p {
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .blogs-filters {
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }

          .admin-table {
            font-size: 12px;
          }

          .admin-table th,
          .admin-table td {
            padding: 8px 12px;
          }

          .blog-actions {
            gap: 4px;
          }

          .action-btn {
            padding: 2px 6px;
            font-size: 14px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
