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

      <div className="profile-wrapper">
        <div className="admin-card">
          <h2 className="profile-section-title">{language === 'en' ? 'Account Information' : 'የሂሳብ መረጃ'}</h2>
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

        <div className="admin-card">
          <h2 className="profile-section-title">{language === 'en' ? 'Change Password' : 'ይለፋት ይቀያይሩ'}</h2>
          <form onSubmit={handleUpdatePassword} className="admin-form">
            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Current Password' : 'የአሁኑ ይለፋት'}</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'New Password' : 'አዲስ ይለፋት'}</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Confirm Password' : 'ይለፋት ያረጋግጡ'}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
      </div>

      <style jsx>{`
        :global(.profile-wrapper) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        :global(.profile-section-title) {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1a1a1a;
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

        :global(.form-input) {
          padding: 10px 12px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Inter', 'Noto Sans Ethiopic', sans-serif;
          color: #1a1a1a;
        }

        :global(.form-input:focus) {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        :global(.form-actions) {
          display: flex;
          justify-content: flex-start;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          :global(.profile-wrapper) {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
