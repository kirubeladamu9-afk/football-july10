import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';

export default function DashboardPage() {
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Dashboard">
      <Head>
        <title>Dashboard - Admin Panel</title>
        <link rel="stylesheet" href="/assets/scss/admin-panel.css" />
      </Head>

      <div className="admin-page-header">
        <h1>{t('dashboard', language)}</h1>
        <p>{t('welcome', language)}</p>
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
      ) : (
        <>
          {stats && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="stat-label">{t('totalArticles', language)}</div>
                  <div className="stat-value">{stats.totalArticles}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-label">{t('published', language)}</div>
                  <div className="stat-value">{stats.publishedArticles}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-file-contract"></i>
                  </div>
                  <div className="stat-label">{t('drafts', language)}</div>
                  <div className="stat-value">{stats.draftArticles}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-video"></i>
                  </div>
                  <div className="stat-label">{t('totalMultimedia', language)}</div>
                  <div className="stat-value">{stats.totalMultimedia}</div>
                </div>
              </div>

              <div className="admin-card">
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0 }}>
                  {t('recentActivity', language)}
                </h2>

                {stats.recentActivity.length > 0 ? (
                  <ul className="recent-activity">
                    {stats.recentActivity.slice(0, 3).map((activity) => (
                      <li key={activity.id}>
                        <i className="activity-icon fas fa-pen-fancy"></i>
                        <strong>
                          {language === 'en' ? activity.titleEn : activity.titleAm}
                        </strong>
                        <span className="activity-time">
                          {activity.status === 'published'
                            ? `${t('published', language)}`
                            : `${t('drafts', language)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="admin-empty">
                    <div className="empty-icon">
                      <i className="fas fa-inbox"></i>
                    </div>
                    <h3>{language === 'en' ? 'No Activity' : 'ምንም እንቅስቃሴ የለም'}</h3>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      <style jsx>{`
        :global(body.admin-panel) {
          background-color: #fafaf9;
          color: #1a1a1a;
          font-family: 'Inter', 'Noto Sans Ethiopic', sans-serif;
          margin: 0;
          padding: 0;
        }

        :global(.admin-layout) {
          display: flex;
          min-height: 100vh;
          background-color: #fafaf9;
        }

        :global(.admin-content) {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        :global(.admin-main) {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          :global(.admin-content) {
            margin-left: 0;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
