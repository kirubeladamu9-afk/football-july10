// Get translated content from database object with fallback
export const getTranslatedField = (item, baseField, language = 'am') => {
  if (!item) return '';

  // Try the language-specific field first (_am or _en)
  const langField = `${baseField}_${language.substring(0, 2)}`;
  if (item[langField]) {
    return item[langField];
  }

  // Fallback to alternate language field
  const altLangField = language === 'am' ? `${baseField}_en` : `${baseField}_am`;
  if (item[altLangField]) {
    return item[altLangField];
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
