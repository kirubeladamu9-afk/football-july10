import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthContext } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!user && router.pathname !== '/admin/login') {
    router.push('/admin/login');
    return null;
  }

  return (
    <>
      <Head>
        <title>{title} - Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="admin-layout">
        {router.pathname !== '/admin/login' && (
          <>
            <Sidebar />
            <div className="admin-content">
              <Header />
              <main className="admin-main">{children}</main>
            </div>
          </>
        )}
        {router.pathname === '/admin/login' && children}
      </div>
    </>
  );
}
