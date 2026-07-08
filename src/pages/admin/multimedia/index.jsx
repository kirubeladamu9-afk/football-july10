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
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchMultimedia();
  }, [filterType]);

  async function fetchMultimedia() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);

      const response = await fetch(`/api/multimedia?${params}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMultimedia(data.multimedia);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(language === 'en' ? 'Are you sure?' : 'እርግጠኛ ነው?')) return;

    try {
      const response = await fetch(`/api/multimedia/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
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

      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/admin/multimedia/new" className="btn btn-primary">
          <i className="fas fa-plus"></i>
          {language === 'en' ? 'New Item' : 'አዲስ ንጥል'}
        </Link>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-select"
          style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #eeeef5' }}
        >
          <option value="">{language === 'en' ? 'All Types' : 'ሁሉም ዓይነቶች'}</option>
          <option value="audio">{t('audio', language)}</option>
          <option value="video">{t('video', language)}</option>
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
      ) : multimedia.length > 0 ? (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('title', language)}</th>
                <th>{t('type', language)}</th>
                <th>{language === 'en' ? 'Duration' : 'ጊዜ ርዝመት'}</th>
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
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor:
                          item.type === 'audio'
                            ? 'rgba(46, 90, 172, 0.1)'
                            : 'rgba(95, 195, 59, 0.1)',
                        color:
                          item.type === 'audio'
                            ? '#2e5aac'
                            : '#5fc33b',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {item.type === 'audio' ? t('audio', language) : t('video', language)}
                    </span>
                  </td>
                  <td>
                    {item.duration ? `${Math.floor(item.duration / 60)}m ${item.duration % 60}s` : '-'}
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
    </AdminLayout>
  );
}
