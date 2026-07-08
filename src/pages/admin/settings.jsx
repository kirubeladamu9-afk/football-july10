import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export default function AdminSettings() {
  const { t, language } = useAdminLanguage();
  const [settings, setSettings] = useState({
    siteName: 'እግር ኳስ፣ ፖለቲካና ሕግ',
    siteNameEn: 'Football, Politics and Law',
    siteDescription: 'ፖለቲካ, ህግ, እና ህብረተ-ሰብ ጠበቅ',
    siteDescriptionEn: 'Politics, Law, and Society Coverage',
    siteUrl: 'https://football-politics-law.et',
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    // In a real implementation, this would save to a database
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="admin-header">
          <h1 className="admin-header-title">{t('siteSettings')}</h1>
        </div>

        {saved && (
          <div className="admin-alert alert-success">
            <span className="alert-icon">✓</span>
            <div className="alert-content">{t('saved')}</div>
          </div>
        )}

        <form onSubmit={handleSave} className="settings-form">
          <div className="settings-section">
            <h2 className="section-title">{language === 'en' ? 'Site Information' : 'የድረ-ገጹ መረጃ'}</h2>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Site Name (Amharic)' : 'የድረ-ገጹ ስም (አማርኛ)'}</label>
              <input
                type="text"
                className="form-input"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Site Name (English)' : 'የድረ-ገጹ ስም (እንግሊዝኛ)'}</label>
              <input
                type="text"
                className="form-input"
                value={settings.siteNameEn}
                onChange={(e) => handleChange('siteNameEn', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Description (Amharic)' : 'ገለጻ (አማርኛ)'}</label>
              <textarea
                className="form-textarea"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? 'Description (English)' : 'ገለጻ (እንግሊዝኛ)'}</label>
              <textarea
                className="form-textarea"
                value={settings.siteDescriptionEn}
                onChange={(e) => handleChange('siteDescriptionEn', e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('siteUrl')}</label>
              <input
                type="url"
                className="form-input"
                value={settings.siteUrl}
                onChange={(e) => handleChange('siteUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">{language === 'en' ? 'Content Settings' : 'ይዘት ቅንጅቶች'}</h2>
            <p className="section-description">
              {language === 'en'
                ? 'Manage categories (Pillars), default content visibility, and other editorial settings.'
                : 'ምድቦችን (ምሩድ), ነባሪ ይዘት ხ idvisibility, እና ሌሎች ኤተሪያል ቅንጅቶችን ያስተዳድሩ።'}
            </p>
            <div className="info-box">
              {language === 'en'
                ? 'Advanced content settings will be added in future updates.'
                : 'ተጨማሪ ይዘት ቅንጅቶች ወደፊት በ updates ይታከላሉ።'}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? (language === 'en' ? 'Saving...' : 'በመቀመጫ ላይ...') : t('save')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-settings {
          padding: 0;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e4;
        }

        .admin-header-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          font-family: 'Noto Sans Ethiopic', sans-serif;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .settings-section {
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          padding: 24px;
        }

        .section-title {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e5e4;
        }

        .section-description {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #666666;
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
        }

        .info-box {
          background-color: #f3f3f2;
          border-left: 3px solid #2e5aac;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 13px;
          color: #666666;
          font-family: 'Inter', sans-serif;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #e5e5e4;
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2e5aac;
          box-shadow: 0 0 0 3px rgba(46, 90, 172, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid #e5e5e4;
        }

        .admin-btn {
          display: inline-block;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
        }

        .admin-btn-primary {
          background-color: #2e5aac;
          color: white;
        }

        .admin-btn-primary:hover:not(:disabled) {
          background-color: #1a3a6b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 90, 172, 0.3);
        }

        .admin-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-alert {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }

        .alert-success {
          background-color: rgba(40, 167, 69, 0.1);
          border: 1px solid rgba(40, 167, 69, 0.3);
          color: #28a745;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .settings-section {
            padding: 16px;
          }

          .admin-header {
            margin-bottom: 24px;
            padding-bottom: 12px;
          }

          .admin-header-title {
            font-size: 20px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
