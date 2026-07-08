export const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },
  
  slug: (value) => {
    const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return regex.test(value);
  },
  
  minLength: (value, min) => {
    return value && value.length >= min;
  },
  
  required: (value) => {
    return value && value.trim().length > 0;
  },
};

export const errorMessages = {
  en: {
    email: 'Please enter a valid email address',
    required: 'This field is required',
    minLength: (length) => `Minimum ${length} characters required`,
    slug: 'Slug must contain only lowercase letters, numbers, and hyphens',
    emailExists: 'This email is already registered',
    invalidCredentials: 'Invalid email or password',
    titleRequired: 'Title is required',
    bodyRequired: 'Body content is required',
    categoryRequired: 'Please select a category',
    typeRequired: 'Please select a type',
    fileUrlRequired: 'File URL is required',
  },
  am: {
    email: 'ትክክለኛ ኢሜይል አድራሻ ያስገቡ',
    required: 'ይህ ሜዳ ሊሞላ ይገባል',
    minLength: (length) => `ቢያንስ ${length} ገፆች ያስፈልግ ነው`,
    slug: 'Slug ትንሽ ፊደላት፣ ቁጥሮች እና ሰረዞች ብቻ መያዝ አለበት',
    emailExists: 'ይህ ኢሜይል ቀድሞ የተመዘገበ ነው',
    invalidCredentials: 'ትክክለኛ ያልሆነ ኢሜይል ወይም ይለፍ ቃል',
    titleRequired: 'ርዕስ ያስፈልጋል',
    bodyRequired: 'የአካል ይዘት ያስፈልጋል',
    categoryRequired: 'እባክዎ ምድብ ይምረጡ',
    typeRequired: 'እባክዎ አይነት ይምረጡ',
    fileUrlRequired: 'ፋይል URL ያስፈልጋል',
  },
};

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
