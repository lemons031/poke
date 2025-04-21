import express from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import vision from '@google-cloud/vision';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = new Storage();
const visionClient = new vision.ImageAnnotatorClient();

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('Request body:', req.body);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  console.log('Uploaded file details:', req.file);

  // Check file type and size
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG and PNG are allowed.' });
  }

  if (req.file.size > 5 * 1024 * 1024) { // 5 MB limit
    return res.status(400).json({ error: 'File size exceeds 5 MB limit.' });
  }

  try {
    const [result] = await visionClient.textDetection(req.file.buffer);
    console.log('Vision API response:', result);
    
    const detections = result.textAnnotations;
    const cardInfo = detections.length > 0 ? detections[0].description : 'No text detected';
    
    res.json({ cardInfo });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing the image. Please try again.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
