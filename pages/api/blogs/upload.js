import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import fs from 'fs';
import { randomUUID } from 'crypto';
import formidable from 'formidable';
import { query } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'Missing file' });
    }

    if (!file.mimetype?.startsWith('image/')) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    const imageData = fs.readFileSync(file.filepath);
    fs.unlinkSync(file.filepath);
    const imageId = randomUUID();

    await query(`
      CREATE TABLE IF NOT EXISTS uploaded_images (
        id CHAR(36) PRIMARY KEY,
        content_type VARCHAR(100) NOT NULL,
        image_data LONGBLOB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    await query(
      'INSERT INTO uploaded_images (id, content_type, image_data) VALUES (?, ?, ?)',
      [imageId, file.mimetype, imageData]
    );

    return res.status(200).json({ success: true, url: `/api/uploads/${imageId}` });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
