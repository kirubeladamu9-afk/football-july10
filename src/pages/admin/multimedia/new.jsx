import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';
import { errorMessages } from '@/lib/validation';

export default function NewMultimediaPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAm: '',
    descriptionEn: '',
    descriptionAm: '',
    fileUrl: '',
    duration: '',
    publishDate: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.titleEn || !formData.titleAm) {
        throw new Error('titleRequired');
      }
      if (!formData.fileUrl) {
        throw new Error('fileUrlRequired');
      }

      const response = await fetch('/api/multimedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titleEn: formData.titleEn,
          titleAm: formData.titleAm,
          descriptionEn: formData.descriptionEn,
          descriptionAm: formData.descriptionAm,
          fileUrl: formData.fileUrl,
          duration: formData.duration ? parseInt(formData.duration) : null,
          publishDate: formData.publishDate || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create');
      }

      router.push('/admin/multimedia');
    } catch (err) {
      const errorKey = err.message;
      setError(errorMessages[language][errorKey] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Multimedia">
      <Head>
        <title>New Multimedia - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{language === 'en' ? 'New Multimedia Item' : 'አዲስ ሙልቲሚዲያ ንጥል'}</h1>
      </div>

      {error && (
        <div className="admin-alert error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">
                {t('title', language)} (English) <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleChange('titleEn', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                {t('title', language)} (Amharic) <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.titleAm}
                onChange={(e) => handleChange('titleAm', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Description' : 'መግለጫ'} (English)</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => handleChange('descriptionEn', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '100px' }}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Description' : 'መግለጫ'} (Amharic)</label>
              <textarea
                value={formData.descriptionAm}
                onChange={(e) => handleChange('descriptionAm', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '100px' }}
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">
                {t('duration', language)} ({language === 'en' ? 'seconds' : 'ሴኮንዶች'})
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="form-input"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {t('fileUrl', language)} <span className="required">*</span>
            </label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={(e) => handleChange('fileUrl', e.target.value)}
              className="form-input"
              placeholder="https://example.com/media.mp3"
              required
            />
            <div className="form-hint">
              {language === 'en' ? 'URL to the media file (MP3, MP4, etc.)' : 'ወደ ሚዲያ ፋይል URL (MP3, MP4, ወዘተ)'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Publish Date' : 'ታተም ዓይነት'}</label>
            <input
              type="datetime-local"
              value={formData.publishDate}
              onChange={(e) => handleChange('publishDate', e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              {t('cancel', language)}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? `${t('loading', language)}...` : t('save', language)}
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
          min-height: 100px;
        }

        :global(.form-hint) {
          font-size: 12px;
          color: #9a9da7;
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
