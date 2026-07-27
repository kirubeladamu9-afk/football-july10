// Get translated content from database object with fallback
export const getTranslatedField = (item, baseField, language = 'am') => {
  if (!item) return '';

  // Try the language-specific field first (_am or _en)
  const langCode = language.substring(0, 2);
  const langField = `${baseField}_${langCode}`;
  const camelLangField = `${baseField}${langCode === 'am' ? 'Am' : 'En'}`;
  if (item[langField]) {
    return item[langField];
  }
  if (item[camelLangField]) {
    return item[camelLangField];
  }

  // Fallback to alternate language field
  const alternateLanguage = language === 'am' ? 'en' : 'am';
  const altLangField = `${baseField}_${alternateLanguage}`;
  const camelAltLangField = `${baseField}${alternateLanguage === 'am' ? 'Am' : 'En'}`;
  if (item[altLangField]) {
    return item[altLangField];
  }
  if (item[camelAltLangField]) {
    return item[camelAltLangField];
  }

  // Fallback to base field without language suffix
  return item[baseField] || '';
};

// Get all translated fields from an item (title, description, content, etc.)
export const getTranslatedItem = (item, fields, language = 'am') => {
  if (!item) return {};

  const translatedItem = { ...item };

  fields.forEach((field) => {
    translatedItem[field] = getTranslatedField(item, field, language);
  });

  return translatedItem;
};
