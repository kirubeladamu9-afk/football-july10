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
          <button className="btn btn-icon" title="Logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
