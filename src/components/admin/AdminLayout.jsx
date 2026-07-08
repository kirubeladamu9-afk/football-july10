import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAdminAuth();
  const { language, switchLanguage } = useAdminLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (!user && !router.pathname.includes('/login')) {
    router.push('/admin/login');
    return null;
  }

  if (router.pathname.includes('/login')) {
    return children;
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>

          <div className="admin-header-actions">
            <div className="admin-language-selector">
              <button
                className={language === 'en' ? 'active' : ''}
                onClick={() => switchLanguage('en')}
              >
                EN
              </button>
              <button
                className={language === 'am' ? 'active' : ''}
                onClick={() => switchLanguage('am')}
              >
                ኦ
              </button>
            </div>

            <div className="admin-user-info">
              {user && (
                <>
                  <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {children}
      </main>

      <style jsx>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #fafaf9;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
          overflow-y: auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e4;
        }

        .admin-header-left {
          flex: 1;
        }

        .admin-header-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .admin-language-selector {
          display: flex;
          gap: 4px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 6px;
          padding: 4px;
        }

        .admin-language-selector button {
          padding: 6px 12px;
          border: none;
          background-color: transparent;
          color: #666666;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .admin-language-selector button.active {
          background-color: #2e5aac;
          color: white;
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #2e5aac;
          color: white;
          border-radius: 50%;
          font-weight: 600;
          font-size: 14px;
        }

        .user-name {
          font-size: 14px;
          color: #333333;
          font-family: 'Inter', sans-serif;
        }

        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #fafaf9;
        }

        .admin-mobile-toggle {
          display: none;
          background-color: #2e5aac;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
          margin-right: 16px;
        }

        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0;
            padding: 16px;
          }

          .admin-mobile-toggle {
            display: block;
          }

          .admin-header {
            margin-bottom: 24px;
            padding-bottom: 12px;
          }

          .user-name {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .admin-main {
            padding: 12px;
          }

          .admin-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .admin-header-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
