import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage, translations, t } from '../hooks/useLanguage';

export default function Sidebar() {
  const router = useRouter();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path) => router.pathname.startsWith(path);

  const navItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-chart-line',
      label: t('dashboard', language),
    },
    {
      path: '/admin/blogs',
      icon: 'fas fa-pen-fancy',
      label: t('blogs', language),
    },
    {
      path: '/admin/multimedia',
      icon: 'fas fa-video',
      label: t('multimedia', language),
    },
    {
      path: '/admin/profile',
      icon: 'fas fa-user',
      label: language === 'en' ? 'My Profile' : 'የእኔ መገለጫ',
    },
  ];

  return (
    <aside className={`admin-sidebar ${!sidebarOpen ? 'closed' : ''}`}>
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo">
          <i className="fas fa-shield-alt"></i>
          <span>Admin</span>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path} className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-user-menu">
          <i className="fas fa-user-circle"></i>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </aside>
  );
}
