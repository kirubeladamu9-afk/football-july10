import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) {
    return res.status(404).end();
  }

  try {
    const result = await query(
      'SELECT content_type, image_data FROM uploaded_images WHERE id = ?',
      [id]
    );
    const image = result.rows[0];

    if (!image) {
      return res.status(404).end();
    }

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', image.content_type);
    return res.status(200).send(image.image_data);
  } catch (error) {
    console.error('Uploaded image fetch error:', error);
    return res.status(500).end();
  }
}
