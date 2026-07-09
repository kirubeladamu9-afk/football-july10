import Link from 'next/link';
import { useAuthContext } from '../hooks/useAuth';
import { useLanguage, t } from '../hooks/useLanguage';

export default function Header() {
  const { user, logout } = useAuthContext();
  const { language, switchLanguage } = useLanguage();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button className="admin-menu-toggle">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="admin-header__right">
        <div className="admin-language-switch">
          <button
            className={`${language === 'en' ? 'active' : ''}`}
            onClick={() => switchLanguage('en')}
          >
            EN
          </button>
          <button
            className={`${language === 'am' ? 'active' : ''}`}
            onClick={() => switchLanguage('am')}
          >
            አ
          </button>
        </div>

        <div className="admin-user-menu-wrapper">
          <Link href="/admin/profile" className="admin-user-profile">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">Admin</div>
            </div>
          </Link>
          <button className="admin-logout-btn" title="Logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.admin-user-menu-wrapper) {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        :global(.admin-user-profile) {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          text-decoration: none;
          color: inherit;
        }

        :global(.admin-user-profile:hover) {
          background-color: rgba(0, 0, 0, 0.05);
        }

        :global(.user-avatar) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #0066cc;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        :global(.user-info) {
          display: none;
          flex-direction: column;
          font-size: 13px;
        }

        @media (min-width: 768px) {
          :global(.user-info) {
            display: flex;
          }

          :global(.user-name) {
            font-weight: 500;
            color: #1a1a1a;
            line-height: 1.2;
          }

          :global(.user-role) {
            color: #666;
            font-size: 11px;
            line-height: 1.2;
          }
        }

        :global(.admin-logout-btn) {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 16px;
          transition: color 0.2s ease;
          border-radius: 4px;
        }

        :global(.admin-logout-btn:hover) {
          color: #1a1a1a;
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </header>
  );
}
