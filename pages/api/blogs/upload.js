import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalFilename || 'jpg');
    const uniqueFilename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    const newPath = path.join(uploadsDir, uniqueFilename);

    // Move file to uploads directory
    fs.renameSync(file.filepath, newPath);

    const fileUrl = `/uploads/${uniqueFilename}`;

    return res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
