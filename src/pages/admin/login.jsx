import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import '../../styles/admin.scss';

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const { t, language, switchLanguage } = useAdminLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="login-header">
            <h1>እግር ኳስ፣ ፖለቲካና ሕግ</h1>
            <p>Football, Politics and Law</p>
            <p className="login-subtitle">Admin Panel</p>
          </div>

          <div className="login-language-selector">
            <button
              className={language === 'en' ? 'active' : ''}
              onClick={() => switchLanguage('en')}
            >
              English
            </button>
            <button
              className={language === 'am' ? 'active' : ''}
              onClick={() => switchLanguage('am')}
            >
              አማርኛ
            </button>
          </div>

          {error && (
            <div className="admin-alert alert-error">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="admin-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="password">
                {language === 'en' ? 'Password' : 'ይለፊ'}
              </label>
              <input
                id="password"
                type="password"
                className="admin-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span> {t('loading')}
                </>
              ) : (
                language === 'en' ? 'Sign In' : 'ገባ'
              )}
            </button>
          </form>

          <div className="login-demo-info">
            <p className="demo-label">
              {language === 'en' ? 'Demo Credentials' : 'ሙከራ መለያ'}
            </p>
            <p className="demo-email">admin@football.et</p>
            <p className="demo-password">{language === 'en' ? 'Password: admin123' : 'ይለፊ: admin123'}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2e5aac 100%);
          padding: 16px;
        }

        .admin-login-container {
          width: 100%;
          max-width: 400px;
        }

        .admin-login-card {
          background-color: #fafaf9;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-header h1 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
        }

        .login-header p {
          margin: 0;
          font-size: 14px;
          color: #666666;
          font-family: 'Inter', sans-serif;
        }

        .login-subtitle {
          font-weight: 500;
          color: #2e5aac;
          margin-top: 8px !important;
        }

        .login-language-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 6px;
          padding: 4px;
        }

        .login-language-selector button {
          flex: 1;
          padding: 8px 12px;
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

        .login-language-selector button.active {
          background-color: #2e5aac;
          color: white;
        }

        form {
          margin-bottom: 24px;
        }

        .login-demo-info {
          background-color: #f3f3f2;
          border-left: 3px solid #2e5aac;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
        }

        .demo-label {
          margin: 0 0 4px 0;
          color: #1a1a1a;
          font-weight: 600;
        }

        .demo-email {
          margin: 0;
          color: #666666;
          word-break: break-all;
        }

        .demo-password {
          margin: 4px 0 0 0;
          color: #666666;
        }

        @media (max-width: 576px) {
          .admin-login-card {
            padding: 24px;
          }

          .login-header h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
