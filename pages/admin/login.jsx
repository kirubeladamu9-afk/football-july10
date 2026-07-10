import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/src/admin/hooks/useAuth';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';
import { errorMessages } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const { language, switchLanguage } = useLanguage('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      const errorKey = err.message;
      setError(errorMessages[language][errorKey] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #eeeef5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0',
              }}
            >
              {language === 'en' ? 'Admin Panel' : 'አስተዳደር ፓነል'}
            </h1>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                padding: '4px',
              }}
            >
              <button
                onClick={() => switchLanguage('en')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  background: language === 'en' ? '#fff' : 'transparent',
                  color: language === 'en' ? '#2e5aac' : '#1a1a1a',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('am')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  background: language === 'am' ? '#fff' : 'transparent',
                  color: language === 'am' ? '#2e5aac' : '#1a1a1a',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                አ
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                backgroundColor: 'rgba(255, 60, 130, 0.1)',
                color: '#ff3c82',
                border: '1px solid rgba(255, 60, 130, 0.2)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                }}
              >
                {t('email', language)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{
                  padding: '10px 12px',
                  border: '1px solid #eeeef5',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2e5aac';
                  e.target.style.boxShadow = '0 0 0 3px rgba(46, 90, 172, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#eeeef5';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1a1a1a',
                }}
              >
                {t('password', language)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  padding: '10px 12px',
                  border: '1px solid #eeeef5',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: "'Inter', 'Noto Sans Ethiopic', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2e5aac';
                  e.target.style.boxShadow = '0 0 0 3px rgba(46, 90, 172, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#eeeef5';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: '#2e5aac',
                color: '#fff',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading && <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>}
              {loading ? (language === 'en' ? 'Signing in...' : 'እየተግበር ነው...') : t('signIn', language)}
            </button>
          </form>

        </div>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}
