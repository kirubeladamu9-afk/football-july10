import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';

export default function MultimediaList() {
  const { t, language } = useAdminLanguage();
  const [multimedia, setMultimedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', status: '', page: 1 });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchMultimedia();
  }, [filter]);

  async function fetchMultimedia() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.status) params.append('status', filter.status);
      params.append('page', filter.page);
      params.append('limit', 20);

      const response = await fetch(`/api/admin/multimedia?${params}`);
      const data = await response.json();
      setMultimedia(data.multimedia);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load multimedia:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await fetch(`/api/admin/multimedia/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMultimedia(multimedia.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  return (
    <AdminLayout>
      <div className="admin-multimedia-page">
        <div className="admin-header">
          <h1 className="admin-header-title">{t('multimedia')}</h1>
          <Link href="/admin/multimedia/create">
            <a className="admin-btn admin-btn-primary">{t('addMultimedia')}</a>
          </Link>
        </div>

        <div className="filters">
          <select
            className="filter-select"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value, page: 1 })}
          >
            <option value="">{t('type')} - All</option>
            <option value="audio">{t('audio')}</option>
            <option value="video">{t('video')}</option>
          </select>

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
        </div>

        {loading ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
          </div>
        ) : multimedia.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">🎬</div>
            <h3>{t('noData')}</h3>
            <Link href="/admin/multimedia/create">
              <a className="admin-btn admin-btn-primary">{t('addMultimedia')}</a>
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('title')}</th>
                  <th>{t('type')}</th>
                  <th>{t('status')}</th>
                  <th>{t('duration')}</th>
                  <th>{t('created')}</th>
                  <th>{language === 'en' ? 'Actions' : 'ተግባራት'}</th>
                </tr>
              </thead>
              <tbody>
                {multimedia.map((media) => (
                  <tr key={media.id}>
                    <td className="title">{language === 'en' ? media.title_en : media.title_am}</td>
                    <td>
                      <span className="type-badge">
                        {media.type === 'audio' ? t('audio') : t('video')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${media.status}`}>
                        {media.status === 'published' ? t('published') : media.status === 'draft' ? t('draft') : t('scheduled')}
                      </span>
                    </td>
                    <td>{media.duration_seconds ? `${Math.round(media.duration_seconds / 60)}m` : '-'}</td>
                    <td className="date">{new Date(media.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link href={`/admin/multimedia/${media.id}/edit`}>
                        <a className="action-btn">✏️</a>
                      </Link>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(media.id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button disabled={filter.page === 1} onClick={() => setFilter({ ...filter, page: filter.page - 1 })}>
                  ←
                </button>
                <span>{filter.page} of {pagination.pages}</span>
                <button disabled={filter.page === pagination.pages} onClick={() => setFilter({ ...filter, page: filter.page + 1 })}>
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-multimedia-page {
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
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }

        .admin-btn-primary {
          background-color: #2e5aac;
          color: white;
        }

        .admin-btn-primary:hover {
          background-color: #1a3a6b;
        }

        .filters {
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

        .table-container {
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

        .title {
          font-weight: 500;
          color: #1a1a1a;
        }

        .type-badge {
          display: inline-block;
          padding: 4px 8px;
          background-color: rgba(46, 90, 172, 0.1);
          color: #2e5aac;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
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

        .date {
          color: #999999;
          font-size: 13px;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 4px 8px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 16px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background-color: #f3f3f2;
        }

        .delete-btn:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-top: 1px solid #e5e5e4;
        }

        .pagination button {
          padding: 6px 12px;
          border: 1px solid #e5e5e4;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .pagination button:hover:not(:disabled) {
          background-color: #2e5aac;
          color: white;
          border-color: #2e5aac;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-loading-state,
        .admin-empty-state {
          text-align: center;
          padding: 48px 24px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .admin-empty-state h3 {
          margin: 0 0 16px 0;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
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
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .filters {
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }

          .admin-table th,
          .admin-table td {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
