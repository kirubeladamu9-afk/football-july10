import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export default function AdminDashboard() {
  const { t } = useAdminLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading-state">
          <div className="admin-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1 className="admin-header-title">{t('dashboard')}</h1>
        </div>

        {error && (
          <div className="admin-alert alert-error">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
          </div>
        )}

        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.blogs.total || 0}</div>
              <div className="stat-label">{t('totalArticles')}</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.blogs.published || 0}</div>
              <div className="stat-label">{t('publishedArticles')}</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.blogs.draft || 0}</div>
              <div className="stat-label">{t('draftArticles')}</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🎬</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.multimedia.total || 0}</div>
              <div className="stat-label">{t('totalMultimedia')}</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🎙️</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.multimedia.podcasts || 0}</div>
              <div className="stat-label">{t('podcasts')}</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-icon">🎥</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.multimedia.videos || 0}</div>
              <div className="stat-label">{t('videos')}</div>
            </div>
          </div>
        </div>

        {stats?.recentActivity && stats.recentActivity.length > 0 && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>{t('recentActivity')}</h3>
              <Link href="/admin/blogs">
                <a className="view-all-link">{t('viewAll')} →</a>
              </Link>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('title')}</th>
                  <th>{t('type')}</th>
                  <th>{t('created')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.slice(0, 5).map((item) => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td className="activity-title">{item.title}</td>
                    <td>
                      <span className="activity-type-badge">
                        {item.type === 'blog' ? t('blogs') : t('multimedia')}
                      </span>
                    </td>
                    <td className="activity-date">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="dashboard-actions">
          <Link href="/admin/blogs/create">
            <a className="admin-btn admin-btn-primary">{t('addArticle')}</a>
          </Link>
          <Link href="/admin/multimedia/create">
            <a className="admin-btn admin-btn-primary">{t('addMultimedia')}</a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
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

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .dashboard-stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .dashboard-stat-card:hover {
          border-color: #2e5aac;
          box-shadow: 0 2px 8px rgba(46, 90, 172, 0.1);
        }

        .stat-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #2e5aac;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .stat-label {
          font-size: 12px;
          color: #666666;
          margin: 4px 0 0 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Inter', sans-serif;
        }

        .admin-card {
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .admin-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e4;
        }

        .admin-card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
        }

        .view-all-link {
          color: #2e5aac;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .view-all-link:hover {
          color: #1a3a6b;
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

        .activity-title {
          font-weight: 500;
          color: #1a1a1a;
        }

        .activity-type-badge {
          display: inline-block;
          padding: 4px 8px;
          background-color: rgba(46, 90, 172, 0.1);
          color: #2e5aac;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .activity-date {
          color: #999999;
          font-size: 13px;
        }

        .dashboard-actions {
          display: flex;
          gap: 12px;
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
          text-align: center;
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

        .admin-alert {
          display: flex;
          gap: 12px;
          padding: 16px;
          background-color: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 6px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #dc3545;
          font-family: 'Inter', sans-serif;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .admin-header {
            margin-bottom: 24px;
            padding-bottom: 12px;
          }

          .admin-header-title {
            font-size: 20px;
          }

          .dashboard-stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .dashboard-stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 24px;
          }

          .stat-icon {
            font-size: 24px;
          }

          .dashboard-actions {
            flex-direction: column;
          }

          .admin-btn {
            width: 100%;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
