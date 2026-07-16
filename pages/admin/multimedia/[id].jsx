import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';
import { errorMessages } from '@/lib/validation';

export default function EditMultimediaPage() {
  const router = useRouter();
  const { id } = router.query;
  const { language } = useLanguage();
  const [loading, setLoading] = useState(!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAm: '',
    descriptionEn: '',
    descriptionAm: '',
    fileUrl: '',
    thumbnailUrl: '',
    duration: '',
    status: 'draft',
  });

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  async function fetchItem() {
    try {
      const response = await fetch(`/api/multimedia/${id}`);
      if (!response.ok) throw new Error('notFound');
      const data = await response.json();
      setFormData({
        titleEn: data.titleEn,
        titleAm: data.titleAm,
        descriptionEn: data.descriptionEn || '',
        descriptionAm: data.descriptionAm || '',
        fileUrl: data.fileUrl,
        thumbnailUrl: data.thumbnailUrl || '',
        duration: data.duration || '',
        status: data.status || 'draft',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const uploadThumbnail = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const response = await fetch('/api/blogs/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: event.target.result, filename: file.name }),
          });

          if (!response.ok) throw new Error('Failed to upload thumbnail');

          const data = await response.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read thumbnail'));
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setSaving(true);

    try {
      handleChange('thumbnailUrl', await uploadThumbnail(file));
    } catch (err) {
      setError(language === 'en' ? 'Failed to upload thumbnail' : 'የድንክዬ ምስል መስቀል አልተሳካም');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/multimedia/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: formData.titleEn,
          titleAm: formData.titleAm,
          descriptionEn: formData.descriptionEn,
          descriptionAm: formData.descriptionAm,
          fileUrl: formData.fileUrl,
          thumbnailUrl: formData.thumbnailUrl || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.push('/admin/multimedia');
    } catch (err) {
      const errorKey = err.message;
      setError(errorMessages[language][errorKey] || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Multimedia">
        <div className="admin-loading">
          <div className="spinner"></div>
          <span>{t('loading', language)}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Multimedia">
      <Head>
        <title>Edit Multimedia - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{language === 'en' ? 'Edit Multimedia Item' : 'ሙልቲሚዲያ ንጥል አርትዖት'}</h1>
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
                className="form-textarea multimedia-description-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Description' : 'መግለጫ'} (Amharic)</label>
              <textarea
                value={formData.descriptionAm}
                onChange={(e) => handleChange('descriptionAm', e.target.value)}
                className="form-textarea multimedia-description-input"
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

          <div className="form-group multimedia-thumbnail-field">
            <label className="form-label">{language === 'en' ? 'Thumbnail Image' : 'የድንክዬ ምስል'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="form-input multimedia-thumbnail-input"
              disabled={saving}
            />
            <div className="form-hint">
              {language === 'en' ? 'Choose an image to use as the multimedia thumbnail.' : 'ለሙልቲሚዲያው ድንክዬ ምስል ይምረጡ።'}
            </div>
            {formData.thumbnailUrl && (
              <div className="multimedia-thumbnail-preview">
                <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="multimedia-thumbnail-image" />
                <button
                  type="button"
                  onClick={() => handleChange('thumbnailUrl', '')}
                  className="multimedia-thumbnail-remove"
                >
                  <i className="fas fa-times"></i>
                  {language === 'en' ? 'Remove' : 'አስወግድ'}
                </button>
              </div>
            )}
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
              required
            />
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{t('status', language)}</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="form-select"
              >
                <option value="draft">{t('drafts', language)}</option>
                <option value="published">{t('published', language)}</option>
              </select>
            </div>
          </div>

          <div className="multimedia-form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              {t('cancel', language)}
            </button>
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
          min-height: 100px;
        }

        :global(.form-hint) {
          font-size: 12px;
          color: #9a9da7;
        }

        :global(.multimedia-description-input) {
          min-height: 100px;
        }

        :global(.multimedia-thumbnail-field) {
          align-items: flex-start;
        }

        :global(.multimedia-thumbnail-input) {
          width: 100%;
        }

        :global(.multimedia-thumbnail-preview) {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        :global(.multimedia-thumbnail-image) {
          width: 140px;
          height: 80px;
          object-fit: cover;
          border: 1px solid #eeeef5;
          border-radius: 6px;
        }

        :global(.multimedia-thumbnail-remove) {
          padding: 8px 10px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          background: #fff;
          color: #1a1a1a;
          cursor: pointer;
        }

        :global(.multimedia-thumbnail-remove i) {
          margin-right: 6px;
        }

        :global(.multimedia-form-actions) {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
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
