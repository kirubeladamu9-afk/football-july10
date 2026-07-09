import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '@/src/admin/components/AdminLayout';
import { useLanguage, t } from '@/src/admin/hooks/useLanguage';
import { errorMessages } from '@/lib/validation';

const CATEGORIES = [
  { value: 'Politics & Power', label: 'Politics & Power', labelAm: 'ፖለቲካ እና ስልጣን' },
  { value: 'Law & Governance', label: 'Law & Governance', labelAm: 'ህግ እና አስተዳደር' },
  { value: 'Society & Ethics', label: 'Society & Ethics', labelAm: 'ማህበረሰብ እና ስነምግባር' },
];

export default function EditBlogPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { language } = useLanguage();
  const [loading, setLoading] = useState(!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAm: '',
    excerptEn: '',
    excerptAm: '',
    bodyEn: '',
    bodyAm: '',
    category: '',
    status: 'draft',
    tags: [],
    tagInput: '',
    coverImage: '',
    authorName: '',
    authorAvatar: '',
    authorRoleEn: '',
    authorRoleAm: '',
    pullQuoteEn: '',
    pullQuoteAm: '',
    pullQuoteAttribution: '',
    publishDate: '',
    featuredImageUrl: '',
  });

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  async function fetchBlog() {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('notFound');
      const data = await response.json();
      setFormData({
        titleEn: data.titleEn,
        titleAm: data.titleAm,
        excerptEn: data.excerptEn || '',
        excerptAm: data.excerptAm || '',
        bodyEn: data.bodyEn,
        bodyAm: data.bodyAm,
        category: data.category,
        status: data.status,
        tags: data.tags || [],
        tagInput: '',
        coverImage: data.coverImage || '',
        authorName: data.authorName || '',
        authorAvatar: data.authorAvatar || '',
        authorRoleEn: data.authorRoleEn || '',
        authorRoleAm: data.authorRoleAm || '',
        pullQuoteEn: data.pullQuoteEn || '',
        pullQuoteAm: data.pullQuoteAm || '',
        pullQuoteAttribution: data.pullQuoteAttribution || '',
        publishDate: data.publishDate || '',
        featuredImageUrl: data.featuredImageUrl || '',
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

  const handleAddTag = () => {
    if (formData.tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titleEn: formData.titleEn,
          titleAm: formData.titleAm,
          excerptEn: formData.excerptEn,
          excerptAm: formData.excerptAm,
          bodyEn: formData.bodyEn,
          bodyAm: formData.bodyAm,
          category: formData.category,
          status: formData.status,
          tags: formData.tags,
          coverImage: formData.coverImage || null,
          authorName: formData.authorName || null,
          authorAvatar: formData.authorAvatar || null,
          authorRoleEn: formData.authorRoleEn || null,
          authorRoleAm: formData.authorRoleAm || null,
          pullQuoteEn: formData.pullQuoteEn || null,
          pullQuoteAm: formData.pullQuoteAm || null,
          pullQuoteAttribution: formData.pullQuoteAttribution || null,
          publishDate: formData.publishDate || null,
          featuredImageUrl: formData.featuredImageUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update');
      }

      router.push('/admin/blogs');
    } catch (err) {
      const errorKey = err.message;
      setError(errorMessages[language][errorKey] || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Blog">
        <div className="admin-loading">
          <div className="spinner"></div>
          <span>{t('loading', language)}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Blog">
      <Head>
        <title>Edit Blog - Admin Panel</title>
      </Head>

      <div className="admin-page-header">
        <h1>{t('editBlog', language)}</h1>
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
              <label className="form-label">{language === 'en' ? 'Excerpt' : 'ጽሑፍ አጭር መግለጫ'} (English)</label>
              <textarea
                value={formData.excerptEn}
                onChange={(e) => handleChange('excerptEn', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Excerpt' : 'ጽሑፍ አጭር መግለጫ'} (Amharic)</label>
              <textarea
                value={formData.excerptAm}
                onChange={(e) => handleChange('excerptAm', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">
                {t('content', language)} (English) <span className="required">*</span>
              </label>
              <textarea
                value={formData.bodyEn}
                onChange={(e) => handleChange('bodyEn', e.target.value)}
                className="form-textarea"
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                {t('content', language)} (Amharic) <span className="required">*</span>
              </label>
              <textarea
                value={formData.bodyAm}
                onChange={(e) => handleChange('bodyAm', e.target.value)}
                className="form-textarea"
                required
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">
                {t('category', language)} <span className="required">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="form-select"
                required
              >
                <option value="">{language === 'en' ? 'Select category' : 'ምድብ ይምረጡ'}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {language === 'en' ? cat.label : cat.labelAm}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Featured Image URL' : 'ይገባ ሙስና ምስል URL'}</label>
              <input
                type="url"
                value={formData.featuredImageUrl}
                onChange={(e) => handleChange('featuredImageUrl', e.target.value)}
                className="form-input"
                placeholder="https://..."
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Cover Image' : 'ሽፋን ምስል'}</label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => handleChange('coverImage', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Name' : 'ደራሲ ስም'}</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => handleChange('authorName', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Avatar URL' : 'ደራሲ የምስል URL'}</label>
              <input
                type="url"
                value={formData.authorAvatar}
                onChange={(e) => handleChange('authorAvatar', e.target.value)}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Role' : 'ደራሲ ሚና'} (English)</label>
              <input
                type="text"
                value={formData.authorRoleEn}
                onChange={(e) => handleChange('authorRoleEn', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Role' : 'ደራሲ ሚና'} (Amharic)</label>
              <input
                type="text"
                value={formData.authorRoleAm}
                onChange={(e) => handleChange('authorRoleAm', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Pull Quote' : 'ይወለወል ጥቅስ'} (English)</label>
              <textarea
                value={formData.pullQuoteEn}
                onChange={(e) => handleChange('pullQuoteEn', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '60px' }}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Pull Quote' : 'ይወለወል ጥቅስ'} (Amharic)</label>
              <textarea
                value={formData.pullQuoteAm}
                onChange={(e) => handleChange('pullQuoteAm', e.target.value)}
                className="form-textarea"
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Pull Quote Attribution' : 'ይወለወል ጥቅስ ምንጭ'}</label>
              <input
                type="text"
                value={formData.pullQuoteAttribution}
                onChange={(e) => handleChange('pullQuoteAttribution', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Publish Date' : 'ለህትመት ጊዜ'}</label>
              <input
                type="datetime-local"
                value={formData.publishDate}
                onChange={(e) => handleChange('publishDate', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('tags', language)}</label>
            <div className="tag-input">
              <input
                type="text"
                value={formData.tagInput}
                onChange={(e) => handleChange('tagInput', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={language === 'en' ? 'Add tag and press Enter' : 'ተህዋስ ጨምር'}
              />
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
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
          min-height: 120px;
        }

        :global(.form-hint) {
          font-size: 12px;
          color: #9a9da7;
        }

        :global(.tag-input) {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          min-height: 40px;
          align-items: center;
        }

        :global(.tag-input input) {
          flex: 1;
          min-width: 100px;
          border: none;
          outline: none;
          font-size: 14px;
        }

        :global(.tag) {
          background-color: #2e5aac;
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
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
