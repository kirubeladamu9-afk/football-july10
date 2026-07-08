import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';

export default function SettingsPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    siteTitle: { en: '', am: '' },
    tagline: { en: '', am: '' },
    description: { en: '', am: '' },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSettings({
        siteTitle: {
          en: data.settings.site_title?.en || '',
          am: data.settings.site_title?.am || '',
        },
        tagline: {
          en: data.settings.tagline?.en || '',
          am: data.settings.tagline?.am || '',
        },
        description: {
          en: data.settings.description?.en || '',
          am: data.settings.description?.am || '',
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (key, lang, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const handleSubmit = async (e, key) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          key: key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          valueEn: settings[key].en,
          valueAm: settings[key].am,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      setSuccess(language === 'en' ? 'Saved successfully!' : 'በተሳካ ሁኔታ ተቀምጧል!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="admin-loading">
          <div className="spinner"></div>
          <span>{t('loading', language)}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <Head>
        <title>Settings - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{t('siteSettings', language)}</h1>
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

      <div className="admin-card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
          {language === 'en' ? 'Site Title' : 'የሳይት ርዕስ'}
        </h2>
        <form onSubmit={(e) => handleSubmit(e, 'siteTitle')} className="admin-form">
          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{t('english', language)}</label>
              <input
                type="text"
                value={settings.siteTitle.en}
                onChange={(e) => handleChange('siteTitle', 'en', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{t('amharic', language)}</label>
              <input
                type="text"
                value={settings.siteTitle.am}
                onChange={(e) => handleChange('siteTitle', 'am', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? `${t('loading', language)}...` : t('save', language)}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
          {language === 'en' ? 'Tagline' : 'መለያ'}
        </h2>
        <form onSubmit={(e) => handleSubmit(e, 'tagline')} className="admin-form">
          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{t('english', language)}</label>
              <textarea
                value={settings.tagline.en}
                onChange={(e) => handleChange('tagline', 'en', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{t('amharic', language)}</label>
              <textarea
                value={settings.tagline.am}
                onChange={(e) => handleChange('tagline', 'am', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? `${t('loading', language)}...` : t('save', language)}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '20px' }}>
          {language === 'en' ? 'Description' : 'መግለጫ'}
        </h2>
        <form onSubmit={(e) => handleSubmit(e, 'description')} className="admin-form">
          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{t('english', language)}</label>
              <textarea
                value={settings.description.en}
                onChange={(e) => handleChange('description', 'en', e.target.value)}
                className="form-textarea"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{t('amharic', language)}</label>
              <textarea
                value={settings.description.am}
                onChange={(e) => handleChange('description', 'am', e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? `${t('loading', language)}...` : t('save', language)}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
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

        :global(.form-group.form-row) {
          flex-direction: row;
          gap: 20px;
        }

        :global(.form-group.form-row .form-field) {
          flex: 1;
        }

        :global(.form-label) {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }

        :global(.form-input),
        :global(.form-textarea),
        :global(.form-select) {
          padding: 10px 12px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Inter', 'Noto Sans Ethiopic', sans-serif;
          color: #1a1a1a;
        }

        :global(.form-textarea) {
          resize: vertical;
          min-height: 120px;
        }

        @media (max-width: 640px) {
          :global(.form-group.form-row) {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
