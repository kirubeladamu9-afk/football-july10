import pool from '../../../../lib/db';
import requireAuth from '../../../../lib/auth-middleware';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return getMultimedia(req, res, id);
  }

  if (req.method === 'PUT') {
    return requireAuth((req, res) => updateMultimedia(req, res, id))(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAuth((req, res) => deleteMultimedia(req, res, id))(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getMultimedia(req, res, mediaId) {
  try {
    const connection = await pool.getConnection();
    try {
      const [media] = await connection.execute(
        'SELECT * FROM multimedia WHERE id = ?',
        [mediaId]
      );

      if (media.length === 0) {
        return res.status(404).json({ error: 'Multimedia not found' });
      }

      return res.status(200).json(media[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get multimedia error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateMultimedia(req, res, mediaId) {
  const {
    type,
    title_en,
    title_am,
    description_en,
    description_am,
    file_url,
    thumbnail_url,
    duration_seconds,
    status,
    publish_date,
  } = req.body;

  try {
    const connection = await pool.getConnection();
    try {
      const [media] = await connection.execute(
        'SELECT * FROM multimedia WHERE id = ?',
        [mediaId]
      );

      if (media.length === 0) {
        return res.status(404).json({ error: 'Multimedia not found' });
      }

      const current = media[0];

      await connection.execute(
        `UPDATE multimedia SET
          type = ?, title_en = ?, title_am = ?, description_en = ?,
          description_am = ?, file_url = ?, thumbnail_url = ?,
          duration_seconds = ?, status = ?, publish_date = ?
        WHERE id = ?`,
        [
          type || current.type,
          title_en || current.title_en,
          title_am || current.title_am,
          description_en !== undefined ? description_en : current.description_en,
          description_am !== undefined ? description_am : current.description_am,
          file_url || current.file_url,
          thumbnail_url !== undefined ? thumbnail_url : current.thumbnail_url,
          duration_seconds !== undefined ? duration_seconds : current.duration_seconds,
          status || current.status,
          publish_date !== undefined ? publish_date : current.publish_date,
          mediaId,
        ]
      );

      return res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update multimedia error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteMultimedia(req, res, mediaId) {
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM multimedia WHERE id = ?',
        [mediaId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Multimedia not found' });
      }

      return res.status(200).json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete multimedia error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
