import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const PILLARS = [
  { value: 'politics', label_en: 'Politics & Power', label_am: 'ፖለቲካ እና ኃይል' },
  { value: 'law', label_en: 'Law & Governance', label_am: 'ህግ እና አስተዳደር' },
  { value: 'society', label_en: 'Society & Ethics', label_am: 'ህብረተ-ሰብ እና ስነ-ምግባር' },
];

const STATUSES = [
  { value: 'draft', label_en: 'Draft', label_am: 'ረቂቅ' },
  { value: 'published', label_en: 'Published', label_am: 'የታተመ' },
  { value: 'scheduled', label_en: 'Scheduled', label_am: 'የታቀደ' },
];

export default function BlogForm() {
  const router = useRouter();
  const { id } = router.query;
  const { t, language } = useAdminLanguage();
  const isEdit = !!id && id !== 'create';

  const [form, setForm] = useState({
    title_en: '',
    title_am: '',
    excerpt_en: '',
    excerpt_am: '',
    body_en: '',
    body_am: '',
    slug: '',
    category: '',
    tags: [],
    featured_image_url: '',
    status: 'draft',
    publish_date: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit && id !== 'create') {
      fetchBlog();
    }
  }, [id, isEdit]);

  async function fetchBlog() {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`);
      const data = await response.json();
      setForm({
        ...data,
        tags: data.tags || [],
      });
    } catch (error) {
      console.error('Failed to load blog:', error);
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

  function handleSlugChange(value) {
    handleChange('slug', value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
  }

  function handleTitleChange(lang, value) {
    handleChange(`title_${lang}`, value);
    if (!form.slug) {
      handleSlugChange(value);
    }
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  }

  function removeTag(tag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.title_en.trim()) newErrors.title_en = t('required');
    if (!form.title_am.trim()) newErrors.title_am = t('required');
    if (!form.body_en.trim()) newErrors.body_en = t('required');
    if (!form.body_am.trim()) newErrors.body_am = t('required');
    if (!form.slug.trim()) newErrors.slug = t('required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/blogs/${id}` : '/api/admin/blogs';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/admin/blogs');
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
      <div className="admin-blog-form">
        <div className="admin-header">
          <h1 className="admin-header-title">
            {isEdit ? t('editArticle') : t('addArticle')}
          </h1>
        </div>

        {errors.form && (
          <div className="admin-alert alert-error">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{errors.form}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'English Content' : 'የእንግሊዝኛ ይዘት'}</h2>

            <div className="form-group">
              <label className="form-label">{t('titleEnglish')}</label>
              <input
                type="text"
                className={`form-input ${errors.title_en ? 'has-error' : ''}`}
                value={form.title_en}
                onChange={(e) => handleTitleChange('en', e.target.value)}
              />
              {errors.title_en && <span className="form-error">{errors.title_en}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('excerptEnglish')}</label>
              <textarea
                className="form-textarea"
                value={form.excerpt_en}
                onChange={(e) => handleChange('excerpt_en', e.target.value)}
                rows="3"
              />
              <span className="form-hint">{language === 'en' ? 'Optional' : 'ፍጆታ'}</span>
            </div>

            <div className="form-group">
              <label className="form-label">{t('bodyEnglish')}</label>
              <div className="editor-wrapper">
                <ReactQuill
                  value={form.body_en}
                  onChange={(value) => handleChange('body_en', value)}
                  theme="snow"
                  modules={{ toolbar: [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline', 'link'], ['blockquote']] }}
                />
              </div>
              {errors.body_en && <span className="form-error">{errors.body_en}</span>}
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
                onChange={(e) => handleTitleChange('am', e.target.value)}
              />
              {errors.title_am && <span className="form-error">{errors.title_am}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('excerptAmharic')}</label>
              <textarea
                className="form-textarea"
                value={form.excerpt_am}
                onChange={(e) => handleChange('excerpt_am', e.target.value)}
                rows="3"
              />
              <span className="form-hint">{language === 'en' ? 'Optional' : 'ፍጆታ'}</span>
            </div>

            <div className="form-group">
              <label className="form-label">{t('bodyAmharic')}</label>
              <div className="editor-wrapper">
                <ReactQuill
                  value={form.body_am}
                  onChange={(value) => handleChange('body_am', value)}
                  theme="snow"
                  modules={{ toolbar: [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline', 'link'], ['blockquote']] }}
                />
              </div>
              {errors.body_am && <span className="form-error">{errors.body_am}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">{language === 'en' ? 'Article Settings' : 'መጣጥፍ ቅንጅቶች'}</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('slug')}</label>
                <input
                  type="text"
                  className={`form-input ${errors.slug ? 'has-error' : ''}`}
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                />
                {errors.slug && <span className="form-error">{errors.slug}</span>}
                {!errors.slug && <span className="form-hint">{t('slugAutoGenerated')}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('pillar')}</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="">{language === 'en' ? 'Select...' : 'ይምረጡ...'}</option>
                  {PILLARS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {language === 'en' ? p.label_en : p.label_am}
                    </option>
                  ))}
                </select>
              </div>
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

            <div className="form-group">
              <label className="form-label">{t('featuredImage')}</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={form.featured_image_url}
                onChange={(e) => handleChange('featured_image_url', e.target.value)}
              />
              {form.featured_image_url && (
                <div className="image-preview">
                  <img src={form.featured_image_url} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">{t('tags')}</label>
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  className="form-input tag-input"
                  placeholder={language === 'en' ? 'Add tag and press Enter' : 'መለያ ጨምር'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button type="button" className="add-tag-btn" onClick={addTag}>
                  {language === 'en' ? 'Add' : 'ጨምር'}
                </button>
              </div>

              {form.tags.length > 0 && (
                <div className="tags-list">
                  {form.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                      <button
                        type="button"
                        className="remove-tag"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? language === 'en' ? 'Saving...' : 'በመቀመጫ ላይ...' : t('save')}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => router.back()}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-blog-form {
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

        .blog-form {
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

        .form-hint {
          display: block;
          color: #999999;
          font-size: 12px;
          margin-top: 4px;
          font-family: 'Inter', sans-serif;
        }

        .editor-wrapper {
          background-color: white;
          border: 1px solid #e5e5e4;
          border-radius: 6px;
          overflow: hidden;
        }

        :global(.editor-wrapper .ql-container) {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          min-height: 300px;
        }

        :global(.editor-wrapper .ql-editor) {
          padding: 12px;
        }

        :global(.editor-wrapper .ql-toolbar) {
          border-bottom: 1px solid #e5e5e4;
          background-color: #f9f9f8;
        }

        .image-preview {
          margin-top: 12px;
          max-width: 100%;
          overflow: hidden;
          border-radius: 6px;
        }

        .image-preview img {
          max-width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: cover;
        }

        .tag-input-wrapper {
          display: flex;
          gap: 8px;
        }

        .tag-input {
          flex: 1;
        }

        .add-tag-btn {
          padding: 10px 16px;
          background-color: #2e5aac;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .add-tag-btn:hover {
          background-color: #1a3a6b;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: #2e5aac;
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
        }

        .remove-tag {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          display: flex;
          align-items: center;
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
          .admin-header {
            margin-bottom: 24px;
          }

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
