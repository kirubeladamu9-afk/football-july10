import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';

const TYPES = [
  { value: 'audio', label_en: 'Podcast', label_am: 'ፖድካስት' },
  { value: 'video', label_en: 'Video', label_am: 'ቪዲዮ' },
];

const STATUSES = [
  { value: 'draft', label_en: 'Draft', label_am: 'ረቂቅ' },
  { value: 'published', label_en: 'Published', label_am: 'የታተመ' },
  { value: 'scheduled', label_en: 'Scheduled', label_am: 'የታቀደ' },
];

export default function MultimediaForm() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useAdminLanguage();
  const isEdit = !!id && id !== 'create';

  const [form, setForm] = useState({
    type: 'audio',
    title_en: '',
    title_am: '',
    description_en: '',
    description_am: '',
    file_url: '',
    thumbnail_url: '',
    duration_seconds: '',
    status: 'draft',
    publish_date: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id !== 'create') {
      fetchMultimedia();
    }
  }, [id, isEdit]);

  async function fetchMultimedia() {
    try {
      const response = await fetch(`/api/admin/multimedia/${id}`);
      const data = await response.json();
      setForm(data);
    } catch (error) {
      console.error('Failed to load multimedia:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.title_en.trim()) newErrors.title_en = t('required');
    if (!form.title_am.trim()) newErrors.title_am = t('required');
    if (!form.file_url.trim()) newErrors.file_url = t('required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/multimedia/${id}` : '/api/admin/multimedia';

      const body = {
        ...form,
        duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/admin/multimedia');
    } catch (error) {
      console.error('Save error:', error);
      setErrors({ form: error.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading-state">
          <div className="admin-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="multimedia-form">
        <div className="admin-header">
          <h1 className="admin-header-title">
            {isEdit ? t('editMultimedia') : t('addMultimedia')}
          </h1>
        </div>

        {errors.form && (
          <div className="admin-alert alert-error">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{errors.form}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'Basic Information' : 'መሰረታዊ መረጃ'}</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('type')}</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {language === 'en' ? t.label_en : t.label_am}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('duration')}</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.duration_seconds}
                  onChange={(e) => handleChange('duration_seconds', e.target.value)}
                  placeholder={language === 'en' ? 'Seconds' : 'ሰከንዶች'}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'English Content' : 'የእንግሊዝኛ ይዘት'}</h2>

            <div className="form-group">
              <label className="form-label">{t('titleEnglish')}</label>
              <input
                type="text"
                className={`form-input ${errors.title_en ? 'has-error' : ''}`}
                value={form.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
              />
              {errors.title_en && <span className="form-error">{errors.title_en}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('descriptionEnglish')}</label>
              <textarea
                className="form-textarea"
                value={form.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'Amharic Content' : 'አማርኛ ይዘት'}</h2>

            <div className="form-group">
              <label className="form-label">{t('titleAmharic')}</label>
              <input
                type="text"
                className={`form-input ${errors.title_am ? 'has-error' : ''}`}
                value={form.title_am}
                onChange={(e) => handleChange('title_am', e.target.value)}
              />
              {errors.title_am && <span className="form-error">{errors.title_am}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('descriptionAmharic')}</label>
              <textarea
                className="form-textarea"
                value={form.description_am}
                onChange={(e) => handleChange('description_am', e.target.value)}
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'Media & Publishing' : 'ሚዲያ እና ማሳተም'}</h2>

            <div className="form-group">
              <label className="form-label">{t('fileUrl')}</label>
              <input
                type="url"
                className={`form-input ${errors.file_url ? 'has-error' : ''}`}
                placeholder="https://..."
                value={form.file_url}
                onChange={(e) => handleChange('file_url', e.target.value)}
              />
              {errors.file_url && <span className="form-error">{errors.file_url}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('thumbnailUrl')}</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={form.thumbnail_url}
                onChange={(e) => handleChange('thumbnail_url', e.target.value)}
              />
              {form.thumbnail_url && (
                <div className="image-preview">
                  <img src={form.thumbnail_url} alt="Thumbnail" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('status')}</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {language === 'en' ? s.label_en : s.label_am}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('publishDate')}</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.publish_date}
                  onChange={(e) => handleChange('publish_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? (language === 'en' ? 'Saving...' : 'በመቀመጫ ላይ...') : t('save')}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => router.back()}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .multimedia-form {
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

        .form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
          padding: 24px;
        }

        .form-section-title {
          margin: 0 0 24px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'Noto Sans Ethiopic', sans-serif;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e4;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
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

        .form-input.has-error {
          border-color: #dc3545;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-error {
          display: block;
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          font-family: 'Inter', sans-serif;
        }

        .image-preview {
          margin-top: 12px;
          max-width: 200px;
          border-radius: 6px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: cover;
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

        .admin-btn-secondary {
          background-color: #e5e5e4;
          color: #1a1a1a;
        }

        .admin-btn-secondary:hover {
          background-color: #d5d5d4;
        }

        .admin-alert {
          display: flex;
          gap: 12px;
          padding: 16px;
          background-color: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 6px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #dc3545;
          font-family: 'Inter', sans-serif;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .admin-loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 8px;
        }

        .admin-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(46, 90, 172, 0.2);
          border-top-color: #2e5aac;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .admin-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
