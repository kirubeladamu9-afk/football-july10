import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';

export default function MultimediaPage() {
  const { language } = useLanguage();
  const [multimedia, setMultimedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMultimedia();
  }, [currentPage]);

  async function fetchMultimedia() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);

      const response = await fetch(`/api/multimedia?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMultimedia(data.multimedia);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(language === 'en' ? 'Are you sure?' : 'እርግጠኛ ነው?')) return;

    try {
      const response = await fetch(`/api/multimedia/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setMultimedia(multimedia.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout title="Multimedia">
      <Head>
        <title>Multimedia - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{t('multimedia', language)}</h1>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/admin/multimedia/new" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '14px', flexShrink: 0 }}>
          <i className="fas fa-plus"></i>
          {language === 'en' ? 'New Item' : 'አዲስ ንጥል'}
        </Link>

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
      ) : multimedia.length > 0 ? (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('title', language)}</th>
                <th>{language === 'en' ? 'Duration' : 'ጊዜ ርዝመት'}</th>
                <th>{t('status', language)}</th>
                <th>{language === 'en' ? 'Actions' : 'ድርጊቶች'}</th>
              </tr>
            </thead>
            <tbody>
              {multimedia.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {language === 'en' ? item.titleEn : item.titleAm}
                    </strong>
                  </td>
                  <td>
                    {item.duration ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s` : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${item.status === 'published' ? 'status-published' : 'status-draft'}`}>
                      {item.status === 'published' ? t('published', language) : t('drafts', language)}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/multimedia/${item.id}`} className="btn btn-secondary btn-icon" title="Edit">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      className="btn btn-danger btn-icon"
                      onClick={() => handleDelete(item.id)}
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
          <h3>{language === 'en' ? 'No Multimedia' : 'ምንም ሙልቲሚዲያ የለም'}</h3>
        </div>
      )}

      {multimedia.length > 0 && totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
            {language === 'en' ? 'Previous' : 'ቀድሞ'}
          </button>

          <div className="pagination-info">
            {language === 'en'
              ? `Page ${currentPage} of ${totalPages}`
              : `ገጽ ${currentPage} of ${totalPages}`}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            {language === 'en' ? 'Next' : 'ቀጣይ'}
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <style jsx>{`
        :global(.admin-table) {
          width: 100%;
          border-collapse: collapse;
        }

        :global(.admin-table tbody tr) {
          border-bottom: 1px solid #eeeef5;
          height: 44px;
        }

        :global(.admin-table td) {
          padding: 8px 12px;
          font-size: 14px;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-published {
          background: rgba(95, 195, 59, 0.1);
          color: #5fc33b;
        }

        .status-draft {
          background: rgba(154, 157, 167, 0.1);
          color: #646873;
        }

        :global(.admin-table th) {
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          background-color: #fafaf9;
          border-bottom: 1px solid #eeeef5;
        }

        :global(.admin-table strong) {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pagination-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
          padding: 16px;
          background-color: #fff;
          border-radius: 6px;
        }

        .pagination-info {
          font-size: 14px;
          color: #1a1a1a;
          min-width: 120px;
          text-align: center;
        }

        :global(.btn:disabled) {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </AdminLayout>
  );
}
