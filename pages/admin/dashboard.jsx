import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

              <div className="admin-charts-grid">
                <div className="admin-card">
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0 }}>
                    {language === 'en' ? 'Content Overview' : 'የይዘት ጠቅላላ እይታ'}
                  </h2>
                  <div className="chart-container">
                    <Bar
                      data={{
                        labels: [
                          language === 'en' ? 'Published' : 'የታተመ',
                          language === 'en' ? 'Drafts' : 'ረቂቅ',
                        ],
                        datasets: [
                          {
                            label: language === 'en' ? 'Articles' : 'መጣጥፎች',
                            data: [stats.publishedArticles, stats.draftArticles],
                            backgroundColor: ['#0066cc', '#ffa500'],
                            borderColor: ['#0052a3', '#ff8c00'],
                            borderWidth: 1,
                            borderRadius: 4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              font: {
                                size: 14,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                              padding: 12,
                            },
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              font: {
                                size: 12,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                            },
                            grid: {
                              color: '#f0f0f0',
                            },
                          },
                          x: {
                            ticks: {
                              font: {
                                size: 12,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                            },
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="admin-card">
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0 }}>
                    {language === 'en' ? 'Articles by Category' : 'መጣጥፎች በምድብ'}
                  </h2>
                  <div className="chart-container">
                    <Bar
                      data={{
                        labels: stats.categories.map((cat) => cat.name),
                        datasets: [
                          {
                            label: language === 'en' ? 'Count' : 'ብዛት',
                            data: stats.categories.map((cat) => cat.count),
                            backgroundColor: '#00a366',
                            borderColor: '#008052',
                            borderWidth: 1,
                            borderRadius: 4,
                          },
                        ],
                      }}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              font: {
                                size: 14,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                              padding: 12,
                            },
                          },
                          title: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              font: {
                                size: 12,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                            },
                            grid: {
                              color: '#f0f0f0',
                            },
                          },
                          y: {
                            ticks: {
                              font: {
                                size: 12,
                                family: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                              },
                              color: '#666',
                            },
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
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

        :global(.admin-charts-grid) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 24px 0;
        }

        :global(.chart-container) {
          position: relative;
          height: 350px;
          margin: 20px 0;
        }

        @media (max-width: 1024px) {
          :global(.admin-charts-grid) {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          :global(.admin-content) {
            margin-left: 0;
          }

          :global(.admin-charts-grid) {
            grid-template-columns: 1fr;
          }

          :global(.chart-container) {
            height: 300px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
