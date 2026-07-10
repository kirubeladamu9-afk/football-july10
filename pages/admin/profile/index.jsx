import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useAuthContext } from '@/src/admin/hooks/useAuth';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setSuccess(language === 'en' ? 'Profile updated successfully!' : 'መገለጫ በተሳካ ሁኔታ ተሻሽሏል!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'ይለፋቶች አይዛመዱም');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters' : 'ይለፋት ቢያንስ 6 ስብስቦች መሆን አለበት');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      setSuccess(language === 'en' ? 'Password updated successfully!' : 'ይለፋት በተሳካ ሁኔታ ተሻሽሏል!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Profile">
        <div className="admin-loading">
          <div className="spinner"></div>
          <span>{t('loading', language)}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Profile">
      <Head>
        <title>Profile - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{language === 'en' ? 'My Profile' : 'የእኔ መገለጫ'}</h1>
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <i className="fas fa-check-circle"></i>
          {success}
        </div>
      )}

      <div className="profile-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'account' ? 'tab-button-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            {language === 'en' ? 'Account Information' : 'የሂሳብ መረጃ'}
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'tab-button-active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            {language === 'en' ? 'Change Password' : 'ይለፋት ይቀያይሩ'}
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'account' && (
            <div className="admin-card">
              <form onSubmit={handleUpdateProfile} className="admin-form">
                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Full Name' : 'ሙሉ ስም'}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Email' : 'ኢሜይል'}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? `${t('loading', language)}...` : t('save', language)}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="admin-card">
              <form onSubmit={handleUpdatePassword} className="admin-form">
                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Current Password' : 'የአሁኑ ይለፋት'}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.currentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      title={showPasswords.currentPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas fa-${showPasswords.currentPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'New Password' : 'አዲስ ይለፋት'}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.newPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      title={showPasswords.newPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas fa-${showPasswords.newPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Confirm Password' : 'ይለፋት ያረጋግጡ'}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      title={showPasswords.confirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas fa-${showPasswords.confirmPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? `${t('loading', language)}...` : t('save', language)}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.profile-container) {
          margin-top: 24px;
        }

        :global(.tabs-header) {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #eeeef5;
          margin-bottom: 0;
        }

        :global(.tab-button) {
          padding: 14px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        :global(.tab-button:hover) {
          color: #1a1a1a;
        }

        :global(.tab-button-active) {
          color: #0066cc;
          border-bottom-color: #0066cc;
        }

        :global(.tab-content) {
          padding: 24px 0;
        }

        :global(.admin-form) {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        :global(.form-group) {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        :global(.form-label) {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        :global(.password-input-wrapper) {
          position: relative;
          display: flex;
          align-items: center;
        }

        :global(.form-input) {
          padding: 10px 12px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Inter', 'Noto Sans Ethiopic', sans-serif;
          color: #1a1a1a;
          width: 100%;
        }

        :global(.password-input-wrapper .form-input) {
          padding-right: 40px;
        }

        :global(.form-input:focus) {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        :global(.password-toggle-btn) {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        :global(.password-toggle-btn:hover) {
          color: #1a1a1a;
        }

        :global(.form-actions) {
          display: flex;
          justify-content: flex-start;
          margin-top: 8px;
        }
      `}</style>
    </AdminLayout>
  );
}
