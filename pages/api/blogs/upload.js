import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';

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
    const { image, filename } = req.body;

    if (!image || !filename) {
      return res.status(400).json({ error: 'Missing image or filename' });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = filename.split('.').pop();
    const uniqueFilename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const filepath = path.join(uploadsDir, uniqueFilename);

    // Write file
    fs.writeFileSync(filepath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    return res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
