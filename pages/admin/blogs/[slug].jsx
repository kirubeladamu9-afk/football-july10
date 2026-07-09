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
    coverImage: '',
    authorName: '',
    authorAvatar: '',
    authorRoleEn: '',
    authorRoleAm: '',
    gallery: [],
    galleryInput: { image: '', caption: '' },
    pullQuoteEn: '',
    pullQuoteAm: '',
    pullQuoteAttribution: '',
    category: '',
    status: 'draft',
    tags: [],
    tagInput: '',
  });

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  async function fetchBlog() {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (!response.ok) throw new Error('notFound');
      const data = await response.json();
      console.log('Fetched blog data:', { authorAvatar: data.authorAvatar });
      setFormData({
        titleEn: data.titleEn,
        titleAm: data.titleAm,
        excerptEn: data.excerptEn || '',
        excerptAm: data.excerptAm || '',
        bodyEn: data.bodyEn,
        bodyAm: data.bodyAm,
        coverImage: data.coverImage || '',
        authorName: data.authorName || '',
        authorAvatar: data.authorAvatar || '',
        authorRoleEn: data.authorRoleEn || '',
        authorRoleAm: data.authorRoleAm || '',
        gallery: data.gallery || [],
        galleryInput: { image: '', caption: '' },
        pullQuoteEn: data.pullQuoteEn || '',
        pullQuoteAm: data.pullQuoteAm || '',
        pullQuoteAttribution: data.pullQuoteAttribution || '',
        category: data.category,
        status: data.status,
        tags: data.tags || [],
        tagInput: '',
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

  const uploadImage = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const response = await fetch('/api/blogs/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: event.target.result,
              filename: file.name,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const data = await response.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (field, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setSaving(true);
        const url = await uploadImage(file);
        handleChange(field, url);
      } catch (err) {
        setError('Failed to upload image');
        console.error('Image upload error:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAddGalleryImage = () => {
    if (formData.galleryInput.image) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, { ...prev.galleryInput }],
        galleryInput: { image: '', caption: '' },
      }));
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && formData.tagInput.length <= 20) {
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
      if (!formData.titleEn || !formData.titleAm) {
        throw new Error('titleRequired');
      }
      if (!formData.bodyEn || !formData.bodyAm) {
        throw new Error('bodyRequired');
      }
      if (!formData.category) {
        throw new Error('categoryRequired');
      }

      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: formData.titleEn,
          titleAm: formData.titleAm,
          excerptEn: formData.excerptEn,
          excerptAm: formData.excerptAm,
          bodyEn: formData.bodyEn,
          bodyAm: formData.bodyAm,
          coverImage: formData.coverImage,
          authorName: formData.authorName,
          authorAvatar: formData.authorAvatar,
          authorRoleEn: formData.authorRoleEn,
          authorRoleAm: formData.authorRoleAm,
          gallery: formData.gallery,
          pullQuoteEn: formData.pullQuoteEn,
          pullQuoteAm: formData.pullQuoteAm,
          pullQuoteAttribution: formData.pullQuoteAttribution,
          category: formData.category,
          status: formData.status,
          tags: formData.tags,
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
          {/* Title Section */}
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
                maxLength="60"
                required
              />
              <div className={`char-counter ${formData.titleEn.length > 60 ? 'over-limit' : ''}`}>
                {formData.titleEn.length}/60
              </div>
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
                maxLength="60"
                required
              />
              <div className={`char-counter ${formData.titleAm.length > 60 ? 'over-limit' : ''}`}>
                {formData.titleAm.length}/60
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Cover/Hero Image' : 'ሙላ/ዋና ምስል'}</label>
            <div className="image-upload-group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('coverImage', e)}
                className="image-input"
              />
              {formData.coverImage && (
                <div className="image-preview">
                  <img src={formData.coverImage} alt="Cover" />
                  <button
                    type="button"
                    onClick={() => handleChange('coverImage', '')}
                    className="remove-image-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Author Section */}
          <div className="form-group">
            <h3 className="section-title">{language === 'en' ? 'Author Information' : 'ደራሲ መረጃ'}</h3>
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
              <label className="form-label">{language === 'en' ? 'Author Avatar' : 'ደራሲ አምሳያ'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('authorAvatar', e)}
                className="form-input"
              />
              {formData.authorAvatar && (
                <div className="avatar-preview">
                  <img src={formData.authorAvatar} alt="Avatar" onError={() => console.log('Avatar image failed to load:', formData.authorAvatar)} />
                </div>
              )}
              {!formData.authorAvatar && slug && (
                <div style={{ fontSize: '12px', color: '#9a9da7', marginTop: '4px' }}>
                  {language === 'en' ? 'No avatar uploaded' : 'አምሳያ አልተወነ'}
                </div>
              )}
            </div>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Role/Title' : 'ደራሲ ሚና/ርዕስ'} (English)</label>
              <input
                type="text"
                value={formData.authorRoleEn}
                onChange={(e) => handleChange('authorRoleEn', e.target.value)}
                className="form-input"
                placeholder={language === 'en' ? 'e.g. CEO Dulalix' : 'ለምሳሌ CEO Dulalix'}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Author Role/Title' : 'ደራሲ ሚና/ርዕስ'} (Amharic)</label>
              <input
                type="text"
                value={formData.authorRoleAm}
                onChange={(e) => handleChange('authorRoleAm', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Excerpt Section */}
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

          {/* Content Section */}
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

          {/* Gallery Section */}
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Gallery (Multiple Images)' : 'ギャラ里(ብዙ ምስሎች)'}</label>
            <div className="gallery-section">
              <div className="form-row">
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          setSaving(true);
                          const url = await uploadImage(file);
                          setFormData((prev) => ({
                            ...prev,
                            galleryInput: { ...prev.galleryInput, image: url },
                          }));
                        } catch (err) {
                          setError('Failed to upload image');
                          console.error('Image upload error:', err);
                        } finally {
                          setSaving(false);
                        }
                      }
                    }}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={formData.galleryInput.caption}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        galleryInput: { ...prev.galleryInput, caption: e.target.value },
                      }))
                    }
                    placeholder={language === 'en' ? 'Image caption' : 'ምስል ተገቢ ስም'}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="btn btn-secondary"
                >
                  {language === 'en' ? 'Add Image' : 'ምስል ጨምር'}
                </button>
              </div>
              {formData.gallery.length > 0 && (
                <div className="gallery-grid">
                  {formData.gallery.map((item, index) => (
                    <div key={index} className="gallery-item">
                      <img src={item.image} alt={`Gallery ${index}`} />
                      <p className="gallery-caption">{item.caption}</p>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="remove-gallery-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pull Quote Section */}
          <div className="form-group">
            <h3 className="section-title">{language === 'en' ? 'Pull Quote' : 'ጥቅስ'}</h3>
          </div>

          <div className="form-group form-row">
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Quote Text' : 'ጥቅስ ጽሑፍ'} (English)</label>
              <textarea
                value={formData.pullQuoteEn}
                onChange={(e) => handleChange('pullQuoteEn', e.target.value.slice(0, 150))}
                className="form-textarea"
                maxLength="150"
                style={{ minHeight: '80px' }}
              />
              <div className={`char-counter ${formData.pullQuoteEn.length > 150 ? 'over-limit' : ''}`}>
                {formData.pullQuoteEn.length}/150
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">{language === 'en' ? 'Quote Text' : 'ጥቅስ ጽሑፍ'} (Amharic)</label>
              <textarea
                value={formData.pullQuoteAm}
                onChange={(e) => handleChange('pullQuoteAm', e.target.value.slice(0, 150))}
                className="form-textarea"
                maxLength="150"
                style={{ minHeight: '80px' }}
              />
              <div className={`char-counter ${formData.pullQuoteAm.length > 150 ? 'over-limit' : ''}`}>
                {formData.pullQuoteAm.length}/150
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Quote Attribution' : 'ጥቅስ ባለቤት'}</label>
            <input
              type="text"
              value={formData.pullQuoteAttribution}
              onChange={(e) => handleChange('pullQuoteAttribution', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category & Status */}
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

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">{t('tags', language)}</label>
            <div className="tag-input">
              <input
                type="text"
                value={formData.tagInput}
                onChange={(e) => handleChange('tagInput', e.target.value.slice(0, 20))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={language === 'en' ? 'Add tag (max 20 chars) and press Enter' : 'ተህዋስ ጨምር (ከ20 ቁምፍ) እና ተነሳ'}
              />
              <span className="tag-char-counter">{formData.tagInput.length}/20</span>
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

          {/* Buttons */}
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

        :global(.section-title) {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 12px 0 0 0;
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

        :global(.char-counter) {
          font-size: 12px;
          color: #9a9da7;
          margin-top: 4px;
        }

        :global(.char-counter.over-limit) {
          color: #dc3545;
          font-weight: 500;
        }

        :global(.image-upload-group) {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        :global(.image-input) {
          padding: 10px 12px;
          border: 1px solid #eeeef5;
          border-radius: 6px;
          font-size: 14px;
        }

        :global(.image-preview),
        :global(.avatar-preview) {
          position: relative;
          width: 100%;
          max-width: 200px;
          height: 200px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #f5f5f5;
        }

        :global(.image-preview img),
        :global(.avatar-preview img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        :global(.remove-image-btn) {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(0, 0, 0, 0.7);
          border: none;
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        :global(.remove-image-btn:hover) {
          background-color: rgba(0, 0, 0, 0.9);
        }

        :global(.gallery-section) {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        :global(.gallery-grid) {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        :global(.gallery-item) {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          background-color: #f5f5f5;
          aspect-ratio: 1;
        }

        :global(.gallery-item img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        :global(.gallery-caption) {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 8px;
          font-size: 12px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :global(.remove-gallery-btn) {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(220, 53, 69, 0.9);
          border: none;
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        :global(.remove-gallery-btn:hover) {
          background-color: rgba(220, 53, 69, 1);
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
          position: relative;
        }

        :global(.tag-input input) {
          flex: 1;
          min-width: 100px;
          border: none;
          outline: none;
          font-size: 14px;
        }

        :global(.tag-char-counter) {
          font-size: 12px;
          color: #9a9da7;
          position: absolute;
          right: 8px;
          top: 8px;
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

          :global(.gallery-grid) {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
        }
      `}</style>
    </AdminLayout>
  );
}
