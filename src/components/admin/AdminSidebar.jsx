import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { logout } = useAdminAuth();
  const { t, language } = useAdminLanguage();

  const isActive = (path) => router.pathname.startsWith(path);

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
  }

  const navItems = [
    {
      label: t('dashboard'),
      href: '/admin',
      icon: '📊',
    },
    {
      label: t('blogs'),
      href: '/admin/blogs',
      icon: '📝',
    },
    {
      label: t('multimedia'),
      href: '/admin/multimedia',
      icon: '🎬',
    },
    {
      label: t('settings'),
      href: '/admin/settings',
      icon: '⚙️',
    },
  ];

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span>FPL</span>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <span className="icon">🚪</span>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}

      <style jsx>{`
        .admin-sidebar {
          width: 260px;
          background-color: #1a1a1a;
          color: white;
          padding: 24px 0;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
            width: 240px;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }
        }

        .admin-sidebar-brand {
          padding: 16px 24px;
          margin-bottom: 32px;
          font-size: 18px;
          font-weight: 700;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-sidebar-nav {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .admin-sidebar-link {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
        }

        .admin-sidebar-link:hover {
          color: white;
          background-color: rgba(46, 90, 172, 0.15);
        }

        .admin-sidebar-link.active {
          background-color: rgba(46, 90, 172, 0.2);
          color: white;
          border-left: 3px solid #2e5aac;
          padding-left: 21px;
        }

        .admin-sidebar-link .icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-sidebar-logout {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .admin-sidebar-logout:hover {
          background-color: rgba(220, 53, 69, 0.2);
        }

        .admin-sidebar-logout .icon {
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;

          @media (max-width: 768px) {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 240px;
          }

          .admin-sidebar-brand {
            font-size: 16px;
            padding: 16px;
            margin-bottom: 24px;
          }

          .admin-sidebar-link {
            padding: 12px 16px;
            font-size: 13px;
          }

          .admin-sidebar-link .icon {
            margin-right: 12px;
          }
        }
      `}</style>
    </>
  );
}
